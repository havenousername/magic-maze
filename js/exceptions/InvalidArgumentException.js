import { AppException } from "./AppException.js";

class InvalidArgumentException extends AppException {
    constructor(message) {
        super(message ?? "Invalid argument exception: Argument was not provided or underfined");
        this.name = "InvalidArgumentException"; 
    }
}

export { InvalidArgumentException }