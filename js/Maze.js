import { Colors } from "./constants/colors.js";
import { InvalidArgumentException } from "./exceptions/InvalidArgumentException.js";
import { NullUndefinedValueException } from "./exceptions/NullUndefinedValueException.js";
import { MazeRoom } from "./maze-objects/MazeRoom.js";
import { MazeObjectMovable } from "./maze-objects/MazeObjectMovable.js";
import { Position } from "./util/Position.js";
import { Rotations } from "./constants/rotations.js";

class Maze {
    static MAZE_SIZE = 7;
    static ROTATIONS = [Rotations.BOTTOM, Rotations.RIGHT, Rotations.TOP, Rotations.LEFT];
    static SIZE = 512;
    static OUTER_SIZE = 150;
    static FIXED_ROOMS = [
        [
            {rotation: Rotations.BOTTOM, src: 1}, 
            {rotation: Rotations.BOTTOM, src: 2}, 
            {rotation: Rotations.BOTTOM, src: 2},
            {rotation: Rotations.RIGHT, src: 1}
        ],
        [
            {rotation: Rotations.LEFT, src: 2}, 
            {rotation: Rotations.LEFT, src: 2}, 
            {rotation: Rotations.BOTTOM, src: 2}, 
            {rotation: Rotations.RIGHT, src: 2}
        ],
        [
            {rotation: Rotations.LEFT, src: 2}, 
            {rotation: Rotations.TOP, src: 2}, 
            {rotation: Rotations.RIGHT, src: 2}, 
            {rotation: Rotations.RIGHT, src: 2}
        ],
        [
            {rotation: Rotations.LEFT, src: 1}, 
            {rotation: Rotations.TOP, src: 2}, 
            {rotation: Rotations.TOP, src: 2}, 
            {rotation: Rotations.TOP, src: 1}
        ]
    ]; 

    #canvas;
    #canvasContext;
    #roomSize;
    #rooms;
    #srcImages;
    #currentRoom;

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
        this.#canvasContext.save();
        this.initCanvas();

        this.#roomSize = (Maze.SIZE) / Maze.MAZE_SIZE;
        this.#rooms = Array(Maze.MAZE_SIZE).fill(Array(Maze.MAZE_SIZE).fill(false));
        this.#srcImages = srcImages;
        this.initRooms();
        this.initCurrentRoom();
    }  

    async initCurrentRoom() {
        const randomImageIndex = this.generateRandomImageIndex();
        const randomRotation = this.generateRandomRotationIndex();

        this.#currentRoom = new MazeObjectMovable(new MazeRoom({
            src: this.#srcImages[randomImageIndex],
            position: new Position(this.#roomSize, this.#roomSize, Maze.SIZE + Maze.OUTER_SIZE, Maze.OUTER_SIZE),
            canvasContext: this.#canvasContext,
            rotation: Maze.ROTATIONS[randomRotation]
        }));

        await this.#currentRoom.draw();
    }

    generateRandomImageIndex = () => Math.round(Math.random() * (this.#srcImages.length - 1));

    generateRandomRotationIndex = () => Math.round(Math.random() * (Maze.ROTATIONS.length - 1));

    async initRooms() {
        this.#rooms = this.#rooms
        .map((roomRow, rowIndex) => roomRow.
            map( (_, roomIndex) => {
                const randomImageIndex = this.generateRandomImageIndex();
                const randomRotation = this.generateRandomRotationIndex();

                const isOnlyOdd = (rowIndex) => (rowIndex + 1) % 2 === 1 && (roomIndex + 1) % 2 === 1;

                if (isOnlyOdd(rowIndex)) {    
                    const mazeProps = Maze.FIXED_ROOMS[ Math.ceil(rowIndex / 2)][Math.ceil(roomIndex / 2)];
                    return new MazeRoom({
                        src: this.#srcImages[mazeProps.src],
                        position: new Position(this.#roomSize, this.#roomSize, (roomIndex * this.#roomSize) + Maze.OUTER_SIZE, (rowIndex * this.#roomSize) + Maze.OUTER_SIZE), 
                        canvasContext: this.#canvasContext,
                        rotation: mazeProps.rotation,
                    });
                }
                return new MazeObjectMovable(new MazeRoom({
                    src: this.#srcImages[randomImageIndex],
                    position: new Position(this.#roomSize, this.#roomSize, (rowIndex * this.#roomSize) + Maze.OUTER_SIZE, (roomIndex * this.#roomSize) + Maze.OUTER_SIZE), 
                    canvasContext: this.#canvasContext,
                    rotation: Maze.ROTATIONS[randomRotation]
                }));
            }));

        this.#rooms.map((roomRow) => roomRow.map(async room => {
            await room.draw();
        }));
    }

    initCanvas() {
        this.#canvas.height = Maze.SIZE + 2 * Maze.OUTER_SIZE;
        this.#canvas.width = Maze.SIZE + 2 * Maze.OUTER_SIZE;

        this.#canvasContext.fillStyle = Colors.BACKGROUND_BLUE;
        this.#canvasContext.fillRect(0, 0, this.#canvas.height, this.#canvas.height);

        this.#canvasContext.fillStyle  = Colors.BACKGROUND_ORANGE;
        this.#canvasContext.fillRect(Maze.OUTER_SIZE, Maze.OUTER_SIZE, this.#canvas.width - 2 * Maze.OUTER_SIZE, this.#canvas.height - 2 * Maze.OUTER_SIZE);
    }
}

export { Maze };