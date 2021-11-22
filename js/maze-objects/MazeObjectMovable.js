import { Direction } from "../constants/direction.js";
import { WrongDirectionException } from "../exceptions/WrongDirectionException.js";
import { Position } from "../util/Position.js";

class MazeObjectMovable {
    #mazeObject
    #positionLimit
    #previousPosition
    constructor(mazeObject, positionLimit) {
        this.#mazeObject = mazeObject;
        this.#positionLimit = positionLimit;
        this.#previousPosition = mazeObject.position;
    }

    async move(x,y, clear) {
        if (clear) {
            clear(this.startPoint.x - 1, this.startPoint.y - 1, this.position.width + 1, this.position.height + 1);    
        }

        this.#mazeObject.changePosition(new Position(this.position.width, this.position.height, x, y));
        await this.#mazeObject.draw();
    }

    async rollbackMove(clear) {
        if (this.position.isEqual(this.#previousPosition)) {
            return;
        }

        this.move(this.#previousPosition.point.x, this.#previousPosition.point.y, clear);
    }

    notAllowMove(direction, coordinate) {
        const isDirectionEnd = direction === Direction.BOTTOM || direction === Direction.RIGHT;
        const isDirectionUnderLimitEnd = coordinate > this.#positionLimit[direction];
        const isDirectionBelowLimitStart = coordinate < this.#positionLimit[direction];
        const doReset = (isDirectionEnd && isDirectionUnderLimitEnd) || (!isDirectionEnd && isDirectionBelowLimitStart);

        return doReset;
    }

    async stepMove(direction, clear, hasItemOnPosition = () => false) {
        this.#previousPosition = this.position;
        let undoMove = false;
        switch (direction) {
            case Direction.LEFT: 
                undoMove = hasItemOnPosition(new Position(this.position.width, this.position.height, this.startPoint.x - this.position.width, this.startPoint.y));
                if (this.notAllowMove(direction, this.startPoint.x - this.position.width) || undoMove) {
                    break;
                }

                await this.move(this.startPoint.x - this.position.width, this.startPoint.y, clear);
                break;
            case Direction.RIGHT: 
                undoMove = hasItemOnPosition(new Position(this.position.width, this.position.height, this.startPoint.x + this.position.width, this.startPoint.y));
                if (this.notAllowMove(direction, this.startPoint.x + this.position.width) || undoMove) {
                    break;
                }
                await this.move(this.startPoint.x + this.position.width, this.startPoint.y, clear);
                break;
            case Direction.TOP: 
                undoMove = hasItemOnPosition(new Position(this.position.width, this.position.height, this.startPoint.x, this.startPoint.y - this.position.height));
                if (this.notAllowMove(direction, this.startPoint.y - this.position.height) || undoMove) {
                    break;
                }
                await this.move(this.startPoint.x, this.startPoint.y - this.position.height, clear);
                break;
            case Direction.BOTTOM:
                undoMove = hasItemOnPosition(new Position(this.position.width, this.position.height, this.startPoint.x, this.startPoint.y + this.position.height));
                if (this.notAllowMove(direction, this.startPoint.y + this.position.height) || undoMove) {
                    break;
                }
                await this.move(this.startPoint.x, this.startPoint.y + this.position.height, clear)
                break;
            default:
                throw new WrongDirectionException(direction)
        }
    }

    removeListeners() {
        this.#mazeObject.removeListeners();
    }

    async rotate(degree) {
        this.#mazeObject.changeRotation(degree);
        this.draw();
    }

    async draw() {
        await this.#mazeObject.draw();
    }

    getNeighbour(direction) {
        return this.#mazeObject.getNeighbour(direction);
    }

    addTreasure(treasure) {
        this.#mazeObject.addTreasure(treasure);
    }

    removeTreasure() {
        this.#mazeObject.removeTreasure();
    }

    calculateValidNeighbours(previousNeighbours, depth) {
        return this.#mazeObject.calculateValidNeighbours(previousNeighbours, depth);
    }

    calculateSteppableNeighbours() {
        return this.#mazeObject.calculateSteppableNeighbours();
    }

    get treasure() {
        return this.#mazeObject.treasure;
    }
 
    get skelethone() {
        return this.#mazeObject.skelethone;
    } 

    get position() {
        return this.#mazeObject.position;
    }

    set src(src) {
        this.#mazeObject.src = src;
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

    get mazeObject() {
        return this.#mazeObject;
    }
}

export { MazeObjectMovable };