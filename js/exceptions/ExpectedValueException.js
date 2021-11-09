class ExpectedValueException extends Error {
    constructor(message) {
        super(message ?? "expected value was not provided");
        this.name = 'ExpectedValueException';
    }
}

export { ExpectedValueException }