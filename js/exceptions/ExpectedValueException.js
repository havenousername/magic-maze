import { AppException } from "./AppException.js";

class ExpectedValueException extends AppException {
    constructor(message) {
        super(message ?? "expected value was not provided");
        this.name = 'ExpectedValueException';
    }
}

export { ExpectedValueException }