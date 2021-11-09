
class InvalidArgumentException extends Error {
    constructor(message) {
        super(message ?? "Invalid argument exception: Argument was not provided or underfined");
        this.name = "InvalidArgumentException"; 
    }
}

export { InvalidArgumentException }