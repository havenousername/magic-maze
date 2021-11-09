class AppException extends Error {
    constructor(message) {
        super(message ?? "Unknown app exception occured");
        this.name = "AppException";
    }
}

export { AppException };