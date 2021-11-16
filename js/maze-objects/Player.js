import { BaseConfig } from "../BaseConfig.js";
import { Direction } from "../constants/direction.js";
import { Position } from "../util/Position.js";
import { MazeObjectMovable } from "./MazeObjectMovable.js";

class Player extends MazeObjectMovable {
    #canvas;
    #name;
    #room;
    #previousSrc;
    #map;
    constructor(mazeObject, positionLimit, canvas, room, map) {
        super(mazeObject, positionLimit);
        this.#canvas = canvas;
        this.#name = BaseConfig.getInstance().parseNameFromSource(this.src);
        this.#room = room;
        this.#previousSrc = BaseConfig.getInstance().takeSelectedSrc(this.src);
        
        // console.log(this.#room.src, this.#activeRoomSrc);
        this.#map = map;
        this.activateClickListener();
    }


    activateClickListener() {
        this.#canvas.addEventListener('click', async e => {
            const allowEventExecution = BaseConfig
                .getInstance()
                .allowEventExecution(
                    e, 
                    this.startPoint, 
                    this.endPoint
                );
            if (allowEventExecution && this.#map.currentPlayer.id === this.id) {
                const neighbours = this.#room.calculateValidNeighbours();

                
                [this.#room,...neighbours].map(async neighbour => {
                    await this.#onActiveChangeSrc(neighbour);
                });

                const currentSrc = this.src;
                this.mazeObject.src = this.#previousSrc;
                this.#previousSrc = currentSrc;
                await this.draw(); 
            }
        });
    } 


    async #onActiveChangeSrc(room) {
        room.src = `${room.src.split('.svg')[0]}-${this.#name}.svg`;
        await room.draw();
    }

    get room() {
        return this.#room;
    }

    get name() {
        return this.#name;
    }

    get map() {
        return this.#map;
    }

    changeRoom() {
        
    }
}


export { Player }