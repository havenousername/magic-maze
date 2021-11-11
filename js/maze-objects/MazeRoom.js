import { BaseConfig } from "../BaseConfig.js";
import { Rotations } from "../constants/rotations.js";
import { AppException } from "../exceptions/AppException.js";
import { Point } from "../util/Point.js";
import { MazeObject } from "./MazeObject.js";


class MazeRoom extends MazeObject {
    #skelethonePoints

    constructor({ src, position, canvasContext, rotation }) {
        super({ src, position, canvasContext, rotation });
        this.#skelethonePoints = [];
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

    #tImageStrategy() {
        const rotationAssoc = {
            [Rotations.BOTTOM]: {
                endOne: ['leftTop', 0, this.halfSize.y],
                endTwo: ['rightTop', 0, this.halfSize.y],
                endThree: ['leftBottom', this.halfSize.x, 0]
            },
            [Rotations.RIGHT]: {
                endOne: ['leftTop',0, this.halfSize.y],
                endTwo: ['leftTop', this.halfSize.x, 0],
                endThree: ['leftBottom', this.halfSize.x, 0]
            },
            [Rotations.TOP]: {
                endOne: ['leftTop', 0, this.halfSize.y],
                endTwo: ['leftTop', this.halfSize.x, 0],
                endThree: ['rightTop', 0, this.halfSize.y],
            },
            [Rotations.LEFT]: {
                endOne: ['leftTop', this.halfSize.x, 0],
                endTwo: ['leftBottom', this.halfSize.x, 0],
                endThree: ['rightTop', 0, this.halfSize.y]
            }
        };

        this.#generateSkelethone(rotationAssoc);
    }

    #bendImageStrategy() {
        const rotationAssoc = {
            [Rotations.BOTTOM]: {
                endOne: ['leftBottom', this.halfSize.x, 0],
                endTwo: ['rightTop', 0, this.halfSize.y],
            },
            [Rotations.RIGHT]: {
                endOne: ['leftTop', 0, this.halfSize.y],
                endTwo: ['leftBottom', this.halfSize.x, 0]
            },
            [Rotations.TOP]: {
                endOne: ['leftTop', 0, this.halfSize.y],
                endTwo: ['leftTop', this.halfSize.x, 0]
            },
            [Rotations.LEFT]: {
                endOne: ['leftTop', 0, this.halfSize.y],
                endTwo: ['rightTop', 0, this.halfSize.y],
            }
        }

        this.#generateSkelethone(rotationAssoc);
    }

    #standardImageStrategy() {
        const rotationAssoc = {
            [Rotations.BOTTOM]: {
                endOne: ['leftTop', 0, this.halfSize.y],
                endTwo: ['rightTop', 0, this.halfSize.y],
            },
            [Rotations.RIGHT]: {
                endOne: ['leftTop', this.halfSize.x, 0],
                endTwo: ['leftBottom', this.halfSize.x, 0]
            },
            [Rotations.TOP]: {
                endOne: ['leftTop', 0, this.halfSize.y],
                endTwo: ['rightTop', 0, this.halfSize.y]
            },
            [Rotations.LEFT]: {
                endOne: ['leftTop', this.halfSize.x, 0],
                endTwo: ['leftBottom', this.halfSize.x, 0]
            }
        }

        this.#generateSkelethone(rotationAssoc);
    }

    #generateSkelethone(strategy) {
        for (let i = 0; i < Object.keys(strategy[this.rotation]).length; i++) {
            const currentEnd = Object.keys(strategy[this.rotation])[i];
            this.#skelethonePoints[i] = new Point(
                this.position[strategy[this.rotation][currentEnd][0]].x + strategy[this.rotation][currentEnd][1], 
                this.position[strategy[this.rotation][currentEnd][0]].y + strategy[this.rotation][currentEnd][2]
            );
        }
    }

    get skelethone() {
        return this.#skelethonePoints;
    } 
}


export { MazeRoom };