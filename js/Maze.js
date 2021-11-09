import { Colors } from "./colors.js";
import { InvalidArgumentException } from "./exceptions/InvalidArgumentException.js";
import { NullUndefinedValueException } from "./exceptions/NullUndefinedValueException.js";
import { MazeObject } from "./maze-objects/MazeObject.js";
import { Position } from "./util/Position.js";

class Maze {
    static size = 7;
    static rotations = [0, 90, 180, 270];

    #canvas;
    #canvasContext;
    #roomSize;
    #rooms;
    #srcImages;

    constructor(canvasId, srcImages) {
        if (!canvasId) {
            throw new InvalidArgumentException("canvas id is undefined");
        }

        const canvas = document.getElementById('game-canvas');
        
        if (!canvas) {
            throw new NullUndefinedValueException("such element doesnt exist in canvas");
        }

        this.#canvas = canvas;
        if (!this.#canvas.getContext) {
            throw new NullUndefinedValueException("canvas doesnt contain 2d context");
        }
        this.#canvasContext = this.#canvas.getContext("2d");
        this.initCanvas();

        this.#roomSize = (this.#canvas.width) / 7;
        this.#rooms = Array(Maze.size).fill(Array(Maze.size).fill(false));
        this.#srcImages = srcImages;
        this.initRooms();
    }  

    initRooms() {
        this.#rooms = this.#rooms
        .map((roomRow, rowIndex) => roomRow.
            map( (_, roomIndex) => {
                if ((rowIndex + 1) % 2 === 1 && (roomIndex + 1) % 2 === 1) {
                    const randomImageIndex = Math.round(Math.random() * (this.#srcImages.length - 1));
                    const randomRotation = Math.round(Math.random() * (Maze.rotations.length - 1));
                    return new MazeObject({
                        src: this.#srcImages[randomImageIndex],
                        position: new Position(this.#roomSize, this.#roomSize, rowIndex * this.#roomSize, roomIndex * this.#roomSize), 
                        canvasContext: this.#canvasContext,
                        rotation: Maze.rotations[randomRotation]
                    })
                }
                return null;
            }));
    }

    initCanvas() {
        this.#canvas.classList.add('game-canvas');
        // DRAW FIRST EMPTY
        // this.#canvasContext.fillStyle = Colors.BACKGROUND_BLUE;
        // this.#canvasContext.fillRect(0, 0, 100, this.#canvas.height);

        this.#canvasContext.fillStyle  = Colors.BACKGROUND_ORANGE;
        this.#canvasContext.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
    }
}

export { Maze };