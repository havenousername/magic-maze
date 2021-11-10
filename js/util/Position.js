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

    get endPoint() {
        return new Point(
            this.#point.x + this.#width,
            this.#point.y + this.#height
        );
    }

    get leftTop() {
        return this.point;
    }

    get rightTop() {
        return new Point(this.point.x + this.#width, this.point.y);
    }

    get leftBottom() {
        return new Point(this.point.x, this.point.y + this.#height);
    }

    get rightBottom() {
        return new Point(this.point.x + this.#width, this.point.y + this.#height);
    }

    hasInsideLine(position, coordinate, dim) {
        return ((position.point[coordinate] > this.#point[coordinate]) 
        && (position.point[coordinate] + position[dim]  < this.#point[coordinate] + this[dim]));
    }
    
    hasInsideX(position) {
        return this.hasInsideLine(position, 'x', 'width');
    }

    hasInsideY(position) {
        return this.hasInsideLine(position, 'y', 'height');
    }

    contains(position) {
        return this.hasInsideX(position) && this.hasInsideY(position);   
    }

    distanceBetween(position) {
        const distance = [
            this.distanceToPoint(position.leftTop),
            this.distanceToPoint(position.rightTop),
            this.distanceToPoint(position.leftBottom), 
            this.distanceToPoint(position.rightBottom)
        ]; 

        return distance.reduce((accum, curr) => {
            const x = accum.x < curr.x ? accum.x : curr.x;
            const y = accum.y < curr.y ? accum.y : curr.y;
            
            return new Point(x, y);
        },new Point(Infinity,Infinity));
    }

    distanceToPoint(point) {
        let currentPointX;
        let currentPointY;

        if (this.point.x < point.x) {
            currentPointX = this.endPoint.x;
        } else {
            currentPointX = this.#point.x;
        }

        if (this.point.y < point.y) {
            currentPointY = this.endPoint.y;
        } else {
            currentPointY = this.#point.y;
        }

        const currentPoint = new Point(currentPointX, currentPointY);

        return new Point(Math.abs(currentPoint.x - point.x), Math.abs(currentPoint.y - point.y));
    }
} 

export { Position };