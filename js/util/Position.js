import { InvalidArgumentException } from "../exceptions/InvalidArgumentException.js";
import { NotInRangeExpception } from "../exceptions/NotInRangeException.js";
import { Point } from "./Point.js";

class Position {
    #width;
    #height;
    #point;

    constructor(width, height, x = 0, y = 0) {
        if (!width || !height) {
            throw new InvalidArgumentException("width and height are not provided");
        }

        if (typeof width !== 'number' && typeof height !== 'number') {
            const errObj = { 'number': x, 'number': y};
            throw new WrongTypeException(errObj);
        } 

        if (width < 0 || height < 0) {
            throw new NotInRangeExpception("width and height should be greater than 0")
        }

        this.#height = height;
        this.#width = width;
        this.#point = new Point(x, y);
    }

    get width() {
        return this.#width;
    }

    get height() {
        return this.#height;
    }

    get point() {
        return this.#point;
    }
} 

export { Position };