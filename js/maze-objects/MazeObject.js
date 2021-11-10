import { InvalidArgumentException } from "../exceptions/InvalidArgumentException.js";
import { Point } from "../util/Point.js";
import { Position } from "../util/Position.js";

class MazeObject {
    static NUMBER_OF_OBJECTS = 0;  
    #position;
    #src;
    #canvasContentRef;
    #rotation;
    #isDrawn;
    #id;

    constructor({ src, position, canvasContext, rotation = 0, id = MazeObject.NUMBER_OF_OBJECTS }) {
        if (!canvasContext) {
            throw new InvalidArgumentException("Maze Object Error. Canvas context was not provided");
        }
        this.#position = position ?? new Position(0, 0, 40, 40);
        this.#src = src;
        this.#rotation = rotation;
        this.#canvasContentRef = canvasContext;
        this.#isDrawn = false;
        this.#id = id;
        MazeObject.NUMBER_OF_OBJECTS++;
    } 

    async draw() {
        return new Promise((resolve, reject) => {
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
                this.#isDrawn = true;
                resolve();
            };
            image.onerror = () => {
                reject();
            }
            image.src = this.#src;
        });
        
    }

    set position(position) {
        this.#position = position;
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

    set rotation(rotation) {
        this.#rotation = rotation;
    }

    get rotation() {
        return this.#rotation;
    }

    get halfSize() {
        return new Point(
            (this.#position.width) / 2,
            this.#position.height / 2
        );
    }

    get endPoint() {
        return this.position.endPoint;
    }
    
    get startPoint() {
        return new Point(
            this.position.point.x, 
            this.position.point.y
        );
    }

    get isRendered() {
        return this.#isDrawn;
    }

    get center() {
        return new Point(
            this.#position.point.x + this.halfSize.x, 
            this.#position.point.y + this.halfSize.y
        );
    }

    get id() {
        return this.#id;
    }
}


export { MazeObject };