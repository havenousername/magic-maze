import { AppException } from "./AppException.js";

class ImageLoadException extends AppException {
    constructor(message) {
        super(message ?? 'Image failed to be loaded. Please check your source string.');
    }
}


export {};