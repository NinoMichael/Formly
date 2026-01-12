/**
 * ==========================================================
 *
 * Form Validator (Framework-agnostic)
 *
 * Orchestrates validation of multiple fields using Field instances.
 * Responsible for:
 * - Creating fields from a schema
 * - Passing values and context
 * - Aggregating validation results
 *
 * ==========================================================
*/

import { createField } from "./Field.js";

export function createFormly(schema = {}) {

    const values = {};
    const fields = {};
    const errors = {};

    // Create field instances
    Object.keys(schema).forEach(fieldName => {
        const fieldSchema = schema[fieldName];
        const field = createField(fieldName, fieldSchema.rules || []);

        values[fieldName] = undefined;
        errors[fieldName] = [];

        fields[fieldName] = {
            get value() {
                return values[fieldName];
            },

            set value(val) {
                values[fieldName] = val;
            },

            get errors() {
                return field.errors;
            },

            get isValid() {
                return field.isValid;
            },

            async validate() {
                const valid = await field.validate(
                    values[fieldName],
                    { values }
                );

                errors[fieldName] = field.errors;
                return valid;
            }
        };
    });

    return {
        ...fields,

        get values() {
            return values;
        },

        get errors() {
            return errors;
        },

        async validate() {
            let isValid = true;

            for (const name in fields) {
                const valid = await fields[name].validate();
                if (!valid) isValid = false;
            }

            return {
                isValid,
                errors
            };
        }
    };
}
