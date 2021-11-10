import { Direction } from "../constants/direction.js";
import { WrongDirectionException } from "../exceptions/WrongDirectionException.js";
import { Position } from "../util/Position.js";

class MazeObjectMovable {
    #mazeObject
    constructor(mazeObject) {
        this.#mazeObject = mazeObject;
    }

    move(x,y, clear) {
        clear(this.startPoint.x, this.startPoint.y, this.position.width, this.position.height);
        this.#mazeObject.position = new Position(this.position.width, this.position.height, x, y);
        this.#mazeObject.draw();
    }

    stepMove(direction, clear) {
        switch (direction) {
            case Direction.LEFT: 
                this.move(this.startPoint.x - this.position.width, this.startPoint.y, clear);
                break;
            case Direction.RIGHT: 
                this.move(this.startPoint.x + this.position.width, this.startPoint.y, clear);
                break;
            case Direction.TOP: 
                this.move(this.startPoint.x, this.startPoint.y - this.position.height, clear);
                break;
            case Direction.BOTTOM:
                this.move(this.startPoint.x, this.startPoint.y + this.position.height, clear)
                break;
            default:
                throw new WrongDirectionException(direction)
        }
    }

    async draw() {
        await this.#mazeObject.draw();
    }

    get position() {
        return this.#mazeObject.position;
    }

    get src() {
        return this.#mazeObject.src;
    }

    get canvasContext() {
        return this.#mazeObject.canvasContext;
    }

    get radRotation() {
        return this.#mazeObject.radRotation;
    }

    get rotation() {
        return this.#mazeObject.rotation;
    }

    get halfSize() {
        return this.#mazeObject.halfSize;
    }

    get startPoint() {
        return this.#mazeObject.startPoint;
    }

    get endPoint() {
        return this.#mazeObject.endPoint;
    }

    get center() {
        return this.#mazeObject.center;
    }

    get isRendered() {
        return this.#mazeObject.isRendered;
    }

    get id() {
        return this.#mazeObject.id;
    }
}

export { MazeObjectMovable };