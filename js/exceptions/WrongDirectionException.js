import { Direction } from "../constants/direction.js";
import { AppException } from "./AppException.js";

class WrongDirectionException extends AppException {
    constructor(position, message) {
        const error = `WrongDirectionException: Expected one of following values: ${Object.entries(Direction).map(([key, val]) => `key: ${key}, value: ${val}`)}, got ${position}`
        super(message ?? error);
        this.name = "WrongDirectionException";
    }
}

export { WrongDirectionException };