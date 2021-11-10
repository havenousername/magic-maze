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

    isEqual(point) {
        return Math.round(point.x) === Math.round(this.x) && Math.round(this.y) === Math.round(point.y);
    }

    isLessX(point) {
        return this.x < point.x;
    }

    isLessY(point) {
        return this.y < point.y;
    }

    isLessOrEqualX(point) {
        return this.y <= point.y;
    }

    isLessOrEqualY(point) {
        return this.y <= point.y;
    }

    isLess(point) {
        return this.isLessX(point) && this.isLessY(point);
    }

    isLessXOrY(point) {
        return this.isLessX(point) || this.isLess(point);
    }

    isLessOrEqualXOrY(point) {
        return this.isLessOrEqualX(point) || this.isLessOrEqualX(point);
    }

    isGreaterXOrY(point) {
        return !this.isLessXOrY(point);
    }

    isGreaterOrEqualXOrY(point) {
        debugger;
        return !this.isLessOrEqualXOrY(point);
    } 

    isLessOrEqual(point) {
        return this.isLessOrEqualX(point) && this.isLessOrEqualY(point);
    }

    isGreater(point) {
        return !this.isLessOrEqual(point);
    }

    isGreaterOrEqual(point) {
        return !this.isLess(point);
    }
}

export { Point };