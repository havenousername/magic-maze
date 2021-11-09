import { ExpectedValueException } from "./ExpectedValueException.js";

class WrongTypeException extends ExpectedValueException {
    constructor(errObj) {
        console.log(Object.entries(errObj))
        const errString = Object.entries(errObj).reduce((res, [key, value]) => {
            res += `${value} should be of type ${key}, got ${typeof value};\n`;
            return res;
        }, ''); 
        super(errString);
        this.name = "WrongTypeException";
    }
}

export { WrongTypeException };