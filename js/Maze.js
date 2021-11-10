import { Colors } from "./constants/colors.js";
import { InvalidArgumentException } from "./exceptions/InvalidArgumentException.js";
import { NullUndefinedValueException } from "./exceptions/NullUndefinedValueException.js";
import { MazeRoom } from "./maze-objects/MazeRoom.js";
import { MazeObjectMovable } from "./maze-objects/MazeObjectMovable.js";
import { Position } from "./util/Position.js";
import { Rotations } from "./constants/rotations.js";
import { ArrowObject } from "./maze-objects/ArrowObject.js";
import { Direction } from "./constants/direction.js";
import { WrongDirectionException } from "./exceptions/WrongDirectionException.js";
import { AppException } from "./exceptions/AppException.js";

class Maze {
    static MAZE_SIZE = 7;
    static ARROWS_SIZE = Math.floor(Maze.MAZE_SIZE / 2) * 4;
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
    #arrows;

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

        this.#arrows = Array(Maze.ARROWS_SIZE).fill(false);
        this.initArrows();
    }  

    async initArrows() {
        this.#arrows = this.#arrows.map((_, index) => {
            const ind = (index % Math.floor(Maze.ARROWS_SIZE / 4) + 1);
            const horizontalX = Maze.OUTER_SIZE + ind * ( Maze.SIZE / 3) - (Maze.SIZE / Maze.MAZE_SIZE);
            const verticalY = index < 6 ?  20 : Maze.SIZE + (Maze.OUTER_SIZE + 110);
            
            let position;
            let rotation = Rotations.LEFT;
            if (index < 3 || index > 8) {
                position = new Position(20, 20, horizontalX, verticalY);
                rotation = index > 8 ? Rotations.TOP : Rotations.BOTTOM;
            } else  {
                position = new Position(20, 20, verticalY, horizontalX);
                rotation = index < 6 ? Rotations.LEFT : Rotations.RIGHT;
            }

            return new ArrowObject(new MazeRoom({
                src: '../assets/arrow.svg',
                position,
                canvasContext: this.#canvasContext,
                rotation: rotation
            }), this, (ind * 2) - 1,  index);
        });
        this.#arrows.map(async arrow => await arrow.draw());
    }

    async initCurrentRoom() {
        const randomImageIndex = this.generateRandomImageIndex();
        const randomRotation = this.generateRandomRotationIndex();

        this.#currentRoom = new MazeObjectMovable(new MazeRoom({
            src: this.#srcImages[randomImageIndex],
            position: new Position(this.#roomSize, this.#roomSize, Maze.OUTER_SIZE + this.#roomSize * 7 , Maze.OUTER_SIZE + this.#roomSize),
            canvasContext: this.#canvasContext,
            rotation: Maze.ROTATIONS[randomRotation]
        }));

        await this.#currentRoom.draw();
    }

    generateRandomImageIndex = () => Math.round(Math.random() * (this.#srcImages.length - 1));

    generateRandomRotationIndex = () => Math.round(Math.random() * (Maze.ROTATIONS.length - 1));

    fillSectionBackground(x,y, width, height) {
        this.#canvasContext.fillStyle = Colors.BACKGROUND_BLUE;
        this.#canvasContext.fillRect(x, y, width, height);
    }

    clearSection = (x,y, width, height) => {
        this.#canvasContext.clearRect(x, y, width, height);
        this.fillSectionBackground(x,y, width, height);
    }

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
                    rotation: Maze.ROTATIONS[randomRotation],
                }));
            }));

        this.#rooms.map((roomRow) => roomRow.map(async room => {
            await room.draw();
        }));
    }

    initCanvas() {
        this.#canvas.height = Maze.SIZE + 2 * Maze.OUTER_SIZE;
        this.#canvas.width = Maze.SIZE + 2 * Maze.OUTER_SIZE;

        this.fillSectionBackground(0, 0, this.#canvas.height, this.#canvas.height);

        this.#canvasContext.fillStyle  = Colors.BACKGROUND_ORANGE;
        this.#canvasContext.fillRect(Maze.OUTER_SIZE, Maze.OUTER_SIZE, this.#canvas.width - 2 * Maze.OUTER_SIZE, this.#canvas.height - 2 * Maze.OUTER_SIZE);
    }

    changeCurrentMove(direction, position) { 
        const isVertical = direction === Direction.TOP || Direction.BOTTOM === direction;
        const modifiableSection = isVertical ? this.takeRoomsRow(position) : this.takeRoomsColumn(position);

        console.log('modifiable section', modifiableSection.map(i => i.id));

        if (modifiableSection.length == 0) {
            throw new AppException("Array of moving objects is empty");
        }

        modifiableSection.map(room => room.stepMove(direction, this.clearSection));

        this.#currentRoom.stepMove(direction, this.clearSection);
        const lastMoving = direction === Direction.BOTTOM || direction === Direction.RIGHT ? modifiableSection[modifiableSection.length - 1] : modifiableSection[0];

        const modifiableIds = modifiableSection.map(i => i.id);
        let previous; 
        const newModifiable = modifiableSection.map((room, index) => {
            if (modifiableIds.includes(room.id)  && (direction === Direction.TOP || direction === Direction.LEFT)) {
                if (modifiableSection[index + 1]) {
                    return modifiableSection[index + 1];
                } else {
                    return this.#currentRoom;
                }
            } else if (modifiableIds.includes(room.id) && (direction === Direction.BOTTOM || direction === Direction.RIGHT)) {
                if (modifiableSection[index - 1]) {
                    const current = previous;
                    previous = room;
                    return current;
                } else {
                    previous = room;
                    return this.#currentRoom;
                }
            } else {
                return room;
            }
        }); 

        this.#rooms = this.#rooms.map((rooms, rowIndex) => rooms.map((room, index) => {
            let ind = modifiableSection.findIndex(i => i.id === room.id);
            if (ind !== -1) {
                return newModifiable[ind];
            }

            return room;
        }));
        
        this.#currentRoom = lastMoving;
    }

    takeRoomsRow(row) {
        return this.#rooms[row];
    }

    takeRoomsColumn(column) {
        return this.transposedRooms[column];
    }

    get transposedRooms() {
        return this.#rooms.reduce((m, r) => (r.forEach((v, i) => (m[i] ??= [], m[i].push(v))), m), []);
    }

    get rooms() {
        return this.#rooms;
    }

    get flatRooms() {
        return this.rooms.flat(1);
    }

    get currentRoom() {
        return this.#currentRoom;
    }

    get canvas() {
        return this.#canvas;
    }

    get arrows() {
        return this.#arrows;
    }
}

export { Maze };