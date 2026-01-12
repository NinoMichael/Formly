/**
 * ==========================================================
 *
 * Field Factory (Framework-agnostic)
 *
 * This module provides a factory function to create a single
 * form field validator. A field is responsible for validating
 * one value against a set of rules.
 *
 * - No DOM dependency
 * - No framework dependency (Vue / React / Vanilla / etc.)
 * - Supports synchronous and asynchronous validation rules
 * - Works with dynamic rules via the Rules proxy
 *
 * A field instance keeps track of:
 * - its name
 * - its validation rules
 * - its validation state (isValid)
 * - its validation errors
 *
 * ==========================================================
*/

import { rules } from "../core/Rules.js";

export function createField(name, fieldRules = []) {
    return {
        name,
        rules: fieldRules,
        errors: [],
        isValid: true,

        async validate(value, context = {}) {
            // Reset validation state before running rules
            this.errors = [];
            this.isValid = true;

            // Iterate over each validation rule
            for (const rule of this.rules) {
                let ruleName, params = [], message;

                // Handle simple rules defined as strings (e.g. "required")
                if (typeof rule === 'string') {
                    ruleName = rule;
                    message = `${this.name} is invalid`;
                }
                // Handle parameterized rules defined as objects (e.g. { minLength: 8 })
                else if (typeof rule === 'object') {
                    ruleName = Object.keys(rule)[0];
                    const ruleValue = rule[ruleName];

                    if (Array.isArray(ruleValue)) {
                        params = [ruleValue[0]];
                        message = ruleValue[1] || `${this.name} failed ${ruleName}`;
                    } else if (typeof ruleValue === 'string') {
                        message = ruleValue;
                    } else {
                        params = [ruleValue];
                        message = `${this.name} failed ${ruleName}`;
                    }
                }

                // Retrieve the validator function from the Rules proxy
                const validator = rules[ruleName];

                // Execute the validator with value, parameters and context
                const result = validator(value, ...params, context);

                // Support both synchronous and asynchronous validators
                const valid = result instanceof Promise ? await result : result;

                // Stop validation on first failure (fail-fast strategy)
                if (!valid) {
                    this.isValid = false;
                    this.errors.push(message);
                    break;
                }
            }

            return this.isValid;
        }
    };
}
