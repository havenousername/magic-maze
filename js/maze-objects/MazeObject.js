import { InvalidArgumentException } from "../exceptions/InvalidArgumentException.js";
import { Point } from "../util/Point.js";
import { Position } from "../util/Position.js";

class MazeObject {
    #position;
    #src;
    #canvasContentRef;
    #rotation;

    constructor({ src, position, canvasContext, rotation = 0 }) {
        if (!canvasContext) {
            throw new InvalidArgumentException("Maze Object Error. Canvas context was not provided");
        }
        this.#position = position ?? new Position(0, 0, 40, 40);
        this.#src = src;
        this.#rotation = rotation;
        this.#canvasContentRef = canvasContext;
        this.initObject();
    } 

    initObject() {
        this.canvasContext.save();
        const image = new Image();
        image.onload = () => {
            this.#canvasContentRef.save();
            //  !Important
            //  setting transform to translate horizontally 
            //  to current position + (current position / 2) [thus moving  origin to center]
            //  and on image draw start drawing from the start
            this.#canvasContentRef
            .setTransform(1, 0, 0, 1, this.center.x, this.center.y);
            this.#canvasContentRef.rotate(this.radRotation);
            this.#canvasContentRef.drawImage(
                image,
                - this.halfSize.x,
                - this.halfSize.y,
                this.#position.width,
                this.#position.height
                );
            this.#canvasContentRef.restore();
        };
        image.src = this.#src;
    }

    get position() {
        return this.#position;
    }

    get src() {
        return this.#src;
    }

    get canvasContext() {
        return this.#canvasContentRef;
    }

    get radRotation() {
        return this.#rotation * Math.PI / 180; 
    }

    get halfSize() {
        return new Point(
            (this.#position.width) / 2,
            this.#position.height / 2
        );
    }

    get center() {
        return new Point(
            this.#position.point.x + this.halfSize.x, 
            this.#position.point.y + this.halfSize.y
        );
    }
}


export { MazeObject };