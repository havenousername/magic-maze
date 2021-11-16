import { BaseConfig } from "../BaseConfig.js";
import { Coordinate } from "../constants/coordinate.js";
import { Direction } from "../constants/direction.js";
import { Rotations } from "../constants/rotations.js";
import { AppException } from "../exceptions/AppException.js";
import { MazeRoomShift } from "../util/MazeRoomShift.js";
import { Point } from "../util/Point.js";
import { Position } from "../util/Position.js";
import { MazeObject } from "./MazeObject.js";


class MazeRoom extends MazeObject {
    #skelethonePoints;
    #mazeShifter;

    constructor({ src, position, canvasContext, rotation }, maze) {
        super({ src, position, canvasContext, rotation });
        this.#skelethonePoints = [];
        this.#mazeShifter = new MazeRoomShift(maze, this);
        this.#initSketethonePoints();
    }

    #initSketethonePoints() {
        switch(this.src) {
            case BaseConfig.getInstance().getStandardRoomSrc(): 
                this.#standardImageStrategy();
                break;
            case BaseConfig.getInstance().getBendRoomSrc(): 
                this.#bendImageStrategy();
                break;
            case BaseConfig.getInstance().getTRoomSrc():
                this.#tImageStrategy();
                break;
            default: 
                return;
        }
    }

    initSketethonePoints() {
        this.#initSketethonePoints();
    }

    #tImageStrategy() {
        const goTop = [0, -this.halfSize.y];
        const goBottom = [0, this.halfSize.y];
        const goLeft = [-this.halfSize.x, 0];
        const goRight = [this.halfSize.x, 0];
        const rotationAssoc = {
            [Rotations.BOTTOM]: {
                endOne: goLeft,
                endTwo: goRight,
                endThree: goBottom
            },
            [Rotations.RIGHT]: {
                endOne: goLeft,
                endTwo: goTop,
                endThree: goBottom
            },
            [Rotations.TOP]: {
                endOne: goLeft,
                endTwo: goTop,
                endThree: goRight,
            },
            [Rotations.LEFT]: {
                endOne: goTop,
                endTwo: goBottom,
                endThree: goRight
            }
        };

        this.#generateSkelethone(rotationAssoc);
    }

    #bendImageStrategy() {
        const goTop = [0, -this.halfSize.y];
        const goBottom = [0, this.halfSize.y];
        const goLeft = [-this.halfSize.x, 0];
        const goRight = [this.halfSize.x, 0];
        const rotationAssoc = {
            [Rotations.BOTTOM]: {
                endOne: goBottom,
                endTwo: goRight,
            },
            [Rotations.RIGHT]: {
                endOne: goBottom,
                endTwo: goLeft
            },
            [Rotations.TOP]: {
                endOne: goLeft,
                endTwo: goTop
            },
            [Rotations.LEFT]: {
                endOne: goTop,
                endTwo: goRight,
            }
        }

        this.#generateSkelethone(rotationAssoc);
    }

    #standardImageStrategy() {
        const goTop = [0, -this.halfSize.y];
        const goBottom = [0, this.halfSize.y];
        const goLeft = [-this.halfSize.x, 0];
        const goRight = [this.halfSize.x, 0];
        const rotationAssoc = {
            [Rotations.BOTTOM]: {
                endOne: goLeft,
                endTwo: goRight,
            },
            [Rotations.RIGHT]: {
                endOne: goTop,
                endTwo: goBottom
            },
            [Rotations.TOP]: {
                endOne: goLeft,
                endTwo: goRight,
            },
            [Rotations.LEFT]: {
                endOne: goTop,
                endTwo: goBottom
            }
        }

        this.#generateSkelethone(rotationAssoc);
    }

    #generateSkelethone(strategy) {
        for (let i = 0; i < Object.keys(strategy[this.circleRotation]).length; i++) {
            const currentEnd = Object.keys(strategy[this.circleRotation])[i];
            this.#skelethonePoints[i] = new Point(
                this.center.x + strategy[this.circleRotation][currentEnd][0], 
                this.center.y + strategy[this.circleRotation][currentEnd][1]
            );
        }
    }


    getNeighbour(direction) {
        const rotationAssoc = {
            [Direction.LEFT]: this.#mazeShifter.prevX, 
            [Direction.TOP]: this.#mazeShifter.prevY,
            [Direction.RIGHT]: this.#mazeShifter.nextX,
            [Direction.BOTTOM]: this.#mazeShifter.nextY,
        };

        return rotationAssoc[direction]();
    }

    getNeighbours(getArray = true) {
        if (getArray) {
            return [
                this.#mazeShifter.prevX(), 
                this.#mazeShifter.prevY(),
                this.#mazeShifter.nextX(),
                this.#mazeShifter.nextY()
            ]
            .filter(neighbour => neighbour);
        }

        return ({
            [Direction.LEFT]: this.#mazeShifter.prevX(), 
            [Direction.TOP]: this.#mazeShifter.prevY(),
            [Direction.RIGHT]: this.#mazeShifter.nextX(),
            [Direction.BOTTOM]: this.#mazeShifter.nextY(),
        })
    }

    calculateValidNeighbours(previousNeighbour = undefined) {
        this.#initSketethonePoints();
        let availableNeighbours = [];

        
        for (const neighbour of this.getNeighbours()) {
            const interactionPoint = this.skelethone.find(point => neighbour.skelethone.find(neighbourPoint => neighbourPoint.isEqual(point)));
            if (interactionPoint && (!previousNeighbour || previousNeighbour.id !== neighbour.id)) {
                availableNeighbours.push(neighbour);
            }
        }

        for (const neighbour of availableNeighbours) {
            availableNeighbours = [...availableNeighbours, ...neighbour.calculateValidNeighbours(this)];
        }

        return availableNeighbours;
    }

    get skelethone() {
        return this.#skelethonePoints;
    } 

    changePosition(position) {
        super.changePosition(position);
        this.initSketethonePoints();
    }

    changeRotation(rotation) {
        super.changeRotation(rotation);
        this.initSketethonePoints();
    }
}


export { MazeRoom };