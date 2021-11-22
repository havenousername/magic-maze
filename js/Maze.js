import { Colors } from "./constants/colors.js";
import { InvalidArgumentException } from "./exceptions/InvalidArgumentException.js";
import { NullUndefinedValueException } from "./exceptions/NullUndefinedValueException.js";
import { MazeRoom } from "./maze-objects/MazeRoom.js";
import { MazeObjectMovable } from "./maze-objects/MazeObjectMovable.js";
import { Position } from "./util/Position.js";
import { Rotations } from "./constants/rotations.js";
import { ArrowObject } from "./maze-objects/ArrowObject.js";
import { Direction } from "./constants/direction.js";
import { AppException } from "./exceptions/AppException.js";
import { WrongDirectionException } from "./exceptions/WrongDirectionException.js";
import { ArrayUtility } from "./util/ArrayUtility.js";
import { BaseConfig } from "./BaseConfig.js";
import { Player } from "./maze-objects/Player.js";
import { MazeObject } from "./maze-objects/MazeObject.js";
import { Treasure } from "./maze-objects/Treasure.js";
import { StepStage } from "./constants/step-stage.js";


class Maze {
    static mazeObjectNumber = 0; 
    static MAZE_SIZE = BaseConfig.getInstance().getMazeSize();
    static ARROWS_SIZE = Math.floor(Maze.MAZE_SIZE / 2) * 4;
    static ROTATIONS = BaseConfig.getInstance().getRotations();
    static SIZE = BaseConfig.getInstance().getMazeCanvasSize();
    static OUTER_SIZE = BaseConfig.getInstance().getOffsetMazeCanvasSize();
    static FIXED_ROOMS =  BaseConfig.getInstance().getMazeFixedRooms();
    static srcImages = BaseConfig.getInstance().getSrcImages();
    static images = ArrayUtility.shuffle([...Array(13).fill(Maze.srcImages[0]), ...Array(15).fill(Maze.srcImages[1]), ...Array(6).fill(Maze.srcImages[2])]);

    #canvas;
    #canvasContext;
    #roomSize;
    #rooms;
    #currentRoom;
    #arrows;
    #players;
    #currentPlayer;
    #playerIndex;
    #lastModifiableSection;
    #step;

    #treasures;
    #parent;

    constructor(canvasId, playersConfig, treasuresSources, parent) {
        if (!canvasId) {
            throw new InvalidArgumentException("canvas id is undefined");
        }

        const canvas = document.getElementById('game-canvas');
        
        if (!canvas) {
            throw new NullUndefinedValueException("such element doesnt exist in canvas");
        }
        this.#playerIndex = 0;
        this.#lastModifiableSection = [];
        this.#players = [];
        this.#canvas = canvas;
        this.#parent = parent;
        if (!this.#canvas.getContext) {
            throw new NullUndefinedValueException("canvas doesnt contain 2d context");
        }
        this.#canvasContext = this.#canvas.getContext("2d");
        this.#canvasContext.save();
        this.initMaze(playersConfig, treasuresSources);
        this.#step = 0;
        Maze.mazeObjectNumber++;
        // console.log(this.#rooms.map(i => i.map(j => [j.id, j])));
    }  

    clearMaze() {
        this.clearSection(0, 0, this.#canvas.width, this.#canvas.height);
    }

    destroy() {
        window.removeEventListener('keydown', this.makeCurrentRoomStep);
        this.#canvas.removeEventListener('click', this.clickEvent);

        this.#players.map(i => i.removeListeners());
        this.flatRooms.map(i => i.removeListeners());
        this.#arrows.map(i => i.removeListeners()); 

        this.#currentPlayer.removeListeners();
        this.#currentRoom.removeListeners();

        this.#currentPlayer = undefined;
        this.#currentRoom = undefined;
        delete this;
    }

    initFromState() {

    } 

    get state() {
        return ({
            canvas: this.#canvas,
            canvasContext:  this.#canvasContext,
            roomSize: this.#roomSize,
            currentRoom: this.#currentRoom,
            currentPlayer: this.#currentPlayer,
            playerIndex: this.#playerIndex,
            lastModifiableSection: this.#lastModifiableSection,
            step: this.#step,
            treasures: this.#treasures,
            rooms: this.#rooms,
            arrows: this.#arrows,
            players: this.#players,
            parent: this.#parent
        });
    }

    saveState() {
        localStorage.setItem("maze-game-state", JSON.stringify(this.state));
    }

    async initState() {
        const state = JSON.parse(localStorage.getItem("maze-game-state"));
        this.canvas =  state.canvas;
        this.canvasContext = state.canvasContext
        this.roomSize =  state.roomSize
        this.currentRoom =  state.currentRoom
        this.currentPlayer =  state.currentPlayer
        this.playerIndex =  state.playerIndex
        this.lastModifiableSection =  state.lastModifiableSection
        this.step = state.step
        this.treasures =  state.treasures
        this.rooms =  state.rooms
        this.arrows =  state.arrows
        this.players =  state.players
        this.parent =  state.parent

        await this.initCanvas();
        this.#rooms.map( async r => await r.draw());
        await this.#currentRoom().draw();
        this.#arrows.map(async i => await i.draw());

        this.addkeyboardEventListeners();
        this.rotateOnClickCurrentRoom();

        this.#players.map(async i => await i.draw());
        await this.#currentPlayer.draw();

        this.#treasures.map(async i => await i.draw());

        setTimeout(() => {
            this.#currentPlayer = this.#players[this.#playerIndex];
            this.#parent.changeCurrentPlayer(this.#currentPlayer);
        });
    }
 

    async initMaze(playersConfig, treasuresSources) {
        await this.initCanvas();

        this.#roomSize = (Maze.SIZE) / Maze.MAZE_SIZE;
        this.#rooms = Array(Maze.MAZE_SIZE).fill(Array(Maze.MAZE_SIZE).fill(false));
        await this.initRooms();
        await this.initCurrentRoom();

        this.#arrows = Array(Maze.ARROWS_SIZE).fill(false);
        await this.initArrows();

        this.addkeyboardEventListeners();
        this.rotateOnClickCurrentRoom();

        await this.initPlayers(playersConfig);
        await this.initTreasures(treasuresSources);
        setTimeout(() => {
            this.#currentPlayer = this.#players[this.#playerIndex];
            this.#parent.changeCurrentPlayer(this.#currentPlayer);
        });
    }

    async initTreasures(treasuresSources) {
        this.#treasures = treasuresSources.map((treasure, index) => {
            let insertRoomIndex = Math.round(Math.random() * (this.flatRooms.length - 1));
            let insertRoom = this.flatRooms[insertRoomIndex];
            while (this.isCornerRoom(insertRoom)) {
                insertRoomIndex = Math.round(Math.random() * (this.flatRooms.length - 1));
                insertRoom = this.flatRooms[insertRoomIndex];
            }
            const playerIndex = index % this.#players.length; 
            const player = this.#players[playerIndex];

            return new Treasure(
                new MazeObject({
                    src: treasure,
                    position: new Position(20, 20, insertRoom.center.x - 20 / 2, insertRoom.center.y - 20 / 2),
                    canvasContext: this.#canvasContext,
                    rotation: 0,
                }),
                { 
                    room: insertRoom,
                    player,
                    isHunted: index < this.#players.length 
                }
            );
        });

        const drawTreasures = this.#treasures.map(t => t.draw());
        await Promise.all(drawTreasures);
    }

    isCornerRoom(room) {
        const cornerRooms = [
            this.leftTopRoom, 
            this.rightBotttomRoom, 
            this.leftBottomRoom, 
            this.rightTopRoom
        ];
        console.log('check room');
        return !!(cornerRooms.find(r => r.id === room.id));
    }
 
    async initPlayers(playersConfig) {
        const cornerRooms = [this.leftTopRoom, this.rightBotttomRoom, this.leftBottomRoom, this.rightTopRoom];
        this.#players = playersConfig.map((player, index) => {
            const src = player.src;
            const currentRoom = cornerRooms[index];
            return new Player(
                new MazeObject({
                    src,
                    position: new Position(35, 35, currentRoom.center.x - 35 / 2, currentRoom.center.y - 35 /2),
                    canvasContext: this.#canvasContext,
                    rotation: 0,
                }),
                player.name,
                this.boundsPlayer, 
                this.#canvas,
                currentRoom,
                this
            );
        });

        this.#players.map(async player => await player.draw());
    }

    async initArrows() {
        this.#arrows = this.#arrows.map((_, index) => {
            const ind = (index % Math.floor(Maze.ARROWS_SIZE / 4) + 1);
            // careful will work only for squares !!
            let horizontalX = Maze.OUTER_SIZE + (ind * 2) * (this.#currentRoom.position.width) - this.#currentRoom.halfSize.x;
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

            return new ArrowObject(new MazeObject({
                src: '../assets/arrow.svg',
                position,
                canvasContext: this.#canvasContext,
                rotation: rotation
            }, this), this, (ind * 2) - 1,  index);
        });
        this.#arrows.map(async arrow => await arrow.draw());
    }

    async initCurrentRoom() {
        const randomImageIndex = this.generateRandomImageIndex();
        const randomRotation = this.generateRandomRotationIndex();

        this.#currentRoom = new MazeObjectMovable(new MazeRoom({
            src: Maze.images[randomImageIndex],
            position: new Position(this.#roomSize, this.#roomSize, Maze.OUTER_SIZE + this.#roomSize * 7 , Maze.OUTER_SIZE + this.#roomSize),
            canvasContext: this.#canvasContext,
            rotation: Maze.ROTATIONS[randomRotation]
        }, this), this.bounds);

        await this.#currentRoom.draw();
    }

    generateRandomImageIndex = () => Math.round(Math.random() * (Maze.images.length - 1));

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
                        src: Maze.srcImages[mazeProps.src],
                        position: new Position(this.#roomSize, this.#roomSize, (rowIndex * this.#roomSize) + Maze.OUTER_SIZE, (roomIndex * this.#roomSize) + Maze.OUTER_SIZE), 
                        canvasContext: this.#canvasContext,
                        rotation: mazeProps.rotation,
                    }, this);
                }

                return new MazeObjectMovable(new MazeRoom({
                    src: Maze.images[randomImageIndex],
                    position: new Position(this.#roomSize, this.#roomSize, (rowIndex * this.#roomSize) + Maze.OUTER_SIZE, (roomIndex * this.#roomSize) + Maze.OUTER_SIZE), 
                    canvasContext: this.#canvasContext,
                    rotation:  roomIndex === 0 && rowIndex === 1  ? 270 : Maze.ROTATIONS[randomRotation],
                }, this), this.bounds);
            }));

        this.#rooms.map((roomRow) => roomRow.map(async room => {
            await room.draw();
        }));  

        // const mazeRoomShift = new MazeRoomShift(this, this.#rooms[5][5]);
        // console.log(this.takeRoomsColumn(5), this.takeRoomsRow(5));
    }

    initCanvas() {
        this.#canvas.height = Maze.SIZE + 2 * Maze.OUTER_SIZE;
        this.#canvas.width = Maze.SIZE + 2 * Maze.OUTER_SIZE;

        this.fillSectionBackground(0, 0, this.#canvas.height, this.#canvas.height);

        this.#canvasContext.fillStyle  = Colors.BACKGROUND_ORANGE;
        this.#canvasContext.fillRect(Maze.OUTER_SIZE, Maze.OUTER_SIZE, this.#canvas.width - 2 * Maze.OUTER_SIZE, this.#canvas.height - 2 * Maze.OUTER_SIZE);
    }

    async changeCurrentMove(direction, position) { 
        const isVertical = direction === Direction.TOP || Direction.BOTTOM === direction;
        const modifiableSection = isVertical ? this.takeRoomsRow(position) : this.takeRoomsColumn(position);

        if (modifiableSection.length == 0) {
            throw new AppException("Array of moving objects is empty");
        }

        modifiableSection.map(room => room.stepMove(direction, this.clearSection).catch(e => {
            if (e instanceof WrongDirectionException) {}
            else console.error(e);
        }));

        this.#currentRoom.stepMove(direction, this.clearSection);
        const lastMoving = direction === Direction.BOTTOM || direction === Direction.RIGHT ? modifiableSection[modifiableSection.length - 1] : modifiableSection[0];
        
        
        if (lastMoving.mazeObject.players.length > 0) {
            this.#currentRoom.mazeObject.addPlayers(lastMoving.mazeObject.players);
            lastMoving.mazeObject.removePlayers();
        }

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

        const newModifiableIds = newModifiable.map(i => i.id);

        const isSameAction = this.#lastModifiableSection.filter((i, index) => i === newModifiableIds[index]).length === newModifiableIds.length;

        if (isSameAction) {
            this.#currentRoom.rollbackMove(this.clearSection);
            modifiableSection.map(room => room.rollbackMove(this.clearSection));
            this.#currentPlayer.stage = StepStage.SLIDE;
            return false;
        }

        this.#lastModifiableSection = modifiableIds; 

        this.#rooms = this.#rooms.map((rooms, rowIndex) => rooms.map((room, index) => {
            let ind = modifiableSection.findIndex(i => i.id === room.id);
            if (ind !== -1) {
                return newModifiable[ind];
            }

            return room;
        }));
        
        this.#currentRoom = lastMoving;
        return true;
    }

    takeRoomsRow(row) {
        return this.#rooms[row];
    }

    takeRoomsColumn(column) {
        return this.transposedRooms[column];
    }

    makeCurrentRoomStep = (e) =>  {
        console.log('STEP, maze count', Maze.mazeObjectNumber);
        const codeAssociation = {
            'ArrowUp': Direction.TOP,
            'ArrowDown': Direction.BOTTOM,
            'ArrowLeft': Direction.LEFT,
            'ArrowRight': Direction.RIGHT,
        }
        e.preventDefault();
        this.#currentRoom.stepMove(codeAssociation[e.code], this.clearSection, this.hasRoomOnPosition).catch(err => {
            if (err instanceof WrongDirectionException) {}
            else {
                console.error(err);
            }
        }); 
    }
    

    addkeyboardEventListeners() {
        window.addEventListener('keydown', this.makeCurrentRoomStep);
        this.#canvas.removeEventListener('click', this.clickEvent);
    }

    clickEvent = e => {
        const isClickedX = this.#currentRoom.startPoint.x < e.offsetX && this.#currentRoom.endPoint.x > e.offsetX;
        const isClickedY = this.#currentRoom.startPoint.y < e.offsetY && this.#currentRoom.endPoint.y > e.offsetY;

        if (isClickedX && isClickedY) {
            this.#currentRoom.rotate(this.#currentRoom.rotation + Rotations.RIGHT);
        }
    }

    rotateOnClickCurrentRoom() {
        this.#canvas.addEventListener('click', this.clickEvent);
    }

    hasRoomOnPosition = (position) => {
        return this.flatRooms.find(room => room.position.isEqual(position));
    }

    get bounds() {
        return ({
            [Direction.LEFT]: Maze.OUTER_SIZE / 2,
            [Direction.TOP]: Maze.OUTER_SIZE / 2,
            [Direction.BOTTOM]: this.#canvas.height - (Maze.OUTER_SIZE ),
            [Direction.RIGHT]: this.#canvas.width - (Maze.OUTER_SIZE ),
        });
    } 

    get boundsPlayer() {
        return ({
            [Direction.LEFT]: Maze.OUTER_SIZE,
            [Direction.TOP]: Maze.OUTER_SIZE,
            [Direction.BOTTOM]: this.#canvas.height - (Maze.OUTER_SIZE * 2),
            [Direction.RIGHT]: this.#canvas.width - (Maze.OUTER_SIZE * 2),

        })
    }
    
    get nextPlayer() {
        return this.#players[(this.#playerIndex + 1) % (this.#players.length)];
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

    get leftTopRoom() {
        const lastOnRow = this.takeRoomsRow(0);
        return lastOnRow[0];
    }

    get rightTopRoom() {
        const lastOnRow = this.takeRoomsRow(0);
        return lastOnRow[lastOnRow.length - 1];
    }

    get leftBottomRoom() {
        const firstOnRow = this.takeRoomsRow(this.#rooms.length - 1);
        return firstOnRow[0];
    }

    get rightBotttomRoom() {
        const lastOnRow = this.takeRoomsRow(this.#rooms.length - 1);
        return lastOnRow[lastOnRow.length - 1];
    }

    get currentPlayer() {
        return this.#currentPlayer;
    }

    set currentPlayer(player) {
        this.#currentPlayer = player;
        this.#playerIndex = (this.#playerIndex + 1) % (this.#players.length);
        this.#parent.changeCurrentPlayer(player);
    }

    get players() {
        return this.#players;
    }

    get isGameOver() {
        return !!(this.#players.find(pl => pl.isFinished));
    }

    get winner() {
        return (this.#players.find(pl => pl.isFinished));
    }

    get step() {
        return this.#step;
    }

    incrementStep() {
        this.#step = this.#step + 1;
    }
}

export { Maze };