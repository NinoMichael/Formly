/**
 * ==========================================================
 *
 * Rules Proxy
 * 
 * A proxy object that provides access to the static methods of the Validator class.
 * It throws an error if a requested validation rule does not exist.
 * 
 * ==========================================================
*/

import { Validator } from "./Validator";

export const rules = new Proxy({}, {
    get: (target, prop) => {
        if (Validator[prop]) return Validator[prop];
        throw new Error(`Rule "${prop}" does not exist`);
    }
});
  