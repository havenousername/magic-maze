import { ExpectedValueException } from "./ExpectedValueException.js";

class NullUndefinedValueException extends ExpectedValueException {
    constructor(message) {
        super(message ?? "Value is null or undefined");
        this.name = "NullUndefinedValueException";
    }
} 

export { NullUndefinedValueException };