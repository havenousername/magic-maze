import { BaseConfig } from "../BaseConfig.js";
import { Direction } from "../constants/direction.js";
import { Rotations } from "../constants/rotations.js";
import { StepStage } from "../constants/step-stage.js";
import { MazeRoomShift } from "../util/MazeRoomShift.js";
import { Point } from "../util/Point.js";
import { MazeObject } from "./MazeObject.js";


class MazeRoom extends MazeObject {
    #skelethonePoints;
    #mazeShifter;
    #maze;
    #players;
    #treasure;

    constructor({ src, position, canvasContext, rotation }, maze) {
        super({ src, position, canvasContext, rotation });
        this.#skelethonePoints = [];
        this.#mazeShifter = new MazeRoomShift(maze, this);
        this.#maze = maze;
        this.#initSketethonePoints();
        this.addClickListener();
        this.#players = [];
        this.#treasure = null;
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

    async draw() {
        await super.draw();

        if (this.#treasure) {
            await this.#treasure.moveToRoom();
        }

        const playersMove = this.players.map(player => player.moveToRoom());
        await Promise.all(playersMove);
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

    addClickListener() {
        document.addEventListener('click', e => {
            const allowEventExecution = BaseConfig
                .getInstance()
                .allowEventExecution(
                    e, 
                    this.startPoint, 
                    this.endPoint
                );
            
            if (allowEventExecution) {
                const currentPlayer = this.#maze.currentPlayer;
                if (currentPlayer.stage === StepStage.SLIDE || !currentPlayer.active) {
                    return;
                }

                if (currentPlayer.isRoomSteppable(this)) {
                    const eventInsidePlayer = BaseConfig
                    .getInstance()
                    .allowEventExecution(
                        e, 
                        currentPlayer.startPoint, 
                        currentPlayer.endPoint
                    );
                    if (eventInsidePlayer) {
                        return;
                    }
                    currentPlayer.changeRoom(this);
                    this.#maze.currentPlayer = this.#maze.nextPlayer;
                }
            }
        })
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

    hasPlayer(player) {
        return this.#players.find(p => player.id === p.id);
    }

    addPlayer(player) {
        if (this.hasPlayer(player)) {
            return;
        }
        player.addRoom(this);
        this.#players.push(player);
    }

    removePlayer(playerId) {
        this.#players = this.#players.filter(p => p.id !== playerId);
    }

    removePlayers() {
        this.#players = [];
    }

    addPlayers(players) {
        players.map(player => this.addPlayer(player));
    }

    
    addTreasure(treasure) {
        this.#treasure = treasure; 
    }

    async removeTreasure() {
        this.#treasure = null;
        await this.draw();
    }

    get treasure() {
        return this.#treasure;
    }


    get players() {
        return this.#players;
    }
}


export { MazeRoom };