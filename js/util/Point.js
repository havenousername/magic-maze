import { WrongTypeException } from "../exceptions/WrongTypeException.js";

class Point {
    #x;
    #y;

    constructor(x,y) {
        if (typeof x !== 'number' || typeof y !== 'number') {
            const errObj = { 'number': x, 'number': y};
            throw new WrongTypeException(errObj);
        }
        this.#x = x ?? 0;
        this.#y = y ?? 0;
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }
}

export { Point };