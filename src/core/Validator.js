/**
 * ==========================================================
 * 
 * Validator Class
 * 
 * A collection of static methods for common form field validations.
 * This class provides built-in validators for required fields, email, phone numbers, passwords,
 * string length checks, and value matching. It also allows adding custom validation rules dynamically.
 * 
 * ==========================================================
*/


export class Validator {
    // Required format validator
    static required(value) {
        return value !== null && value !== undefined && value !== '';
    }

    // Email format validator
    static email(value) {
        const regex = /^[^\s@]+\.[^\s@]+$/;
        return regex.test(value);
    }

    // Phone number format validator
    static phone(value) {
        const regex = /^\+?[0-9]\d{7,15}$/;
        return regex.test(value);
    }

    // Standard password format validator
    static password(value) {
        const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
        return regex.test(value);
    }

    // Min length format validator
    static minLength(value, length) {
        return typeof value === 'string' && value.length >= length;
    }

    // Max length format validator
    static maxLength(value, length) {
        return typeof value === 'string' && value.length <= length;
    }

    // Match format validator
    static match(value, otherFieldName, context) {
        return value === context.values[otherFieldName];
    }    

    // Custom rule addition
    static addRule(name, fn) {
        Validator[name] = fn;
    }
}