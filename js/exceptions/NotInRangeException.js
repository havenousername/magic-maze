import { ExpectedValueException } from "./ExpectedValueException.js";

class NotInRangeExpception extends ExpectedValueException {
    constructor(message) {
        super(message ?? "Value was not in expected range");
        this.name = 'NotInRangeExpception';
    }
}

export { NotInRangeExpception };