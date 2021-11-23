import { BaseConfig } from "../BaseConfig.js";
import { MazeObjectMovable } from "./MazeObjectMovable.js";
import { StepStage } from "../constants/step-stage.js";

class Player extends MazeObjectMovable {
    #canvas;
    #name;
    #room;
    #previousSrc;
    #maze;
    #roomSrc;
    #active;
    #prevSources; 
    #stage;
    #steppableRooms;
    #collectedTreasures;
    #assignedTreasures;
    #score
    #startRoomId;
    #finished;

    constructor(mazeObject, name, positionLimit, canvas, room, map) {
        super(mazeObject, positionLimit);
        this.#canvas = canvas;
        this.#name = name;
        room.addPlayer(this);
        this.#maze = map;
        this.#roomSrc = BaseConfig.getInstance().parseNameFromSource(room.src);
        this.#previousSrc = this.src;
        this.#active = false;
        this.#prevSources = [];
        this.#stage = StepStage.SLIDE; 
        this.#startRoomId = room.id;
        this.#steppableRooms = [];
        this.#collectedTreasures = [];
        this.#assignedTreasures = [];
        this.#score = 0;
        this.#finished = false;
        this.activateClickListener();
    }

    async draw() {
        await super.draw();
    }

    clickEvent = async e => {
        const allowEventExecution = BaseConfig
            .getInstance()
            .allowEventExecution(
                e, 
                this.startPoint, 
                this.endPoint
            );
        if (allowEventExecution && this.#maze.currentPlayer.id === this.id && this.#stage === StepStage.MOVE) {
            this.#active = !this.#active;

            if (this.#active) {
                const neighbours = this.#room.calculateSteppableNeighbours();
                this.#steppableRooms = neighbours;
                [...neighbours].map(async neighbour => {
                    await this.#onActiveChangeSrc(neighbour);
                });
                this.#previousSrc = this.#room.src;
                this.#room.src =  BaseConfig.getInstance().getCurrentPath() + './../assets/selected/' + this.#roomSrc + '.svg';
            } else {
                this.applyPreviousSources();
                this.#room.src = BaseConfig.getInstance().getCurrentPath() +  './../assets/' + this.#roomSrc + '.svg';
            }   
            await this.#room.draw();
        }
    }

    removeListeners() {
        this.#canvas.removeEventListener('click', this.clickEvent);
    } 

    activateClickListener() {
        this.#canvas.addEventListener('click', this.clickEvent);
    } 

    async applyPreviousSources() {
        this.#prevSources.map(async source => {
            const room = this.#maze.flatRooms.find(room => room.id === source.id);    
            if (room) {
                room.src = source.src;
                room.draw();
            }
        });
    }

    async #onActiveChangeSrc(room) {
        this.#prevSources.push({ id: room.id, src: room.src });
        room.src =  BaseConfig.getInstance().getCurrentPath() + './../assets/steppable/' + BaseConfig.getInstance().parseNameFromSource(room.src) + '.svg';
        await room.draw();
    }

    get room() {
        return this.#room;
    }

    set room(room) {
        room.addPlayer(this);
    }

    addRoom(room) {
        this.#room = room;
        this.#roomSrc = BaseConfig.getInstance().parseNameFromSource(room.src);
    }

    get name() {
        return this.#name;
    }

    get map() {
        return this.#maze;
    }

    get stage() {
        return this.#stage;
    }

    set stage(stage) {
        this.#stage = stage;
    }

    get active() {
        return this.#active;
    }

    get steppableRooms() {
        return [...this.#steppableRooms, this.#room];
    }

    isRoomSteppable(room) {
        return this.steppableRooms.find(r => r.id === room.id);
    }
    
    async moveToRoom() {
        await this.move(this.room.center.x - 35 / 2, this.room.center.y - 35 /2);
    }

    async changeRoom(room) {
        if (room.id === this.#startRoomId && this.completedTreasures) {
            this.#finished = true;
        }
        this.#room.src = BaseConfig.getInstance().getCurrentPath() + './../assets/' + this.#roomSrc + '.svg';
        this.#room.removePlayer(this.id);
        this.applyPreviousSources();
        this.room.draw();
        this.room = room;
        this.moveToRoom();
        this.room.draw();
        this.#roomSrc = BaseConfig.getInstance().parseNameFromSource(room.src);
        this.collectTreasure(room);
        this.#stage = StepStage.SLIDE;
    }

    associateTreasure(treasure) {
        this.#assignedTreasures.push(treasure);
    }

    associatedTreasureIndex(treasure) {
        if (!treasure) return -1;
        return this.#assignedTreasures.findIndex(t => t.id === treasure.id);
    }

    collectTreasure(room) {
        console.log('collect treasure');
        const treasureIndex = this.associatedTreasureIndex(room.treasure);

        if (treasureIndex === -1) {
            return;
        }

        const movingTreasure = this.#assignedTreasures[treasureIndex];
        if (!movingTreasure.isHunted) {
            return;
        }

        this.#assignedTreasures = this.#assignedTreasures.filter(tr => tr.id !== movingTreasure.id);
        movingTreasure.collect();
        this.#collectedTreasures.push(movingTreasure);
        this.#score += movingTreasure.points;

        if (this.#assignedTreasures.length > 0) {
            this.#assignedTreasures[0].makeHuntable();
        }
    }

    get completedTreasures() {
        return this.#assignedTreasures.length === 0 && this.#collectedTreasures.length > 0;
    }

    get huntedTreasure() {
        return this.#assignedTreasures.find(tr => tr.isHunted);
    }

    get score() {
        return this.#score;
    }

    get treasuresLeft() {
        return this.#assignedTreasures.length;
    }

    get isFinished() {
        return this.#finished;
    }
} 


export { Player }