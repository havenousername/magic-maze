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
    #roomSrc;
    #active;
    constructor(mazeObject, positionLimit, canvas, room, map) {
        super(mazeObject, positionLimit);
        this.#canvas = canvas;
        this.#name = BaseConfig.getInstance().parseNameFromSource(this.src);
        this.#room = room;
        this.#previousSrc = BaseConfig.getInstance().takeSelectedSrc(this.src);
        
        // console.log(this.#room.src, this.#activeRoomSrc);
        this.#map = map;
        this.#roomSrc = BaseConfig.getInstance().parseNameFromSource(room.src);
        this.#active = false;
        this.#prevSources = [];
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
                this.#active = !this.#active;

                if (this.#active) {
                    const neighbours = this.#room.calculateValidNeighbours();
                    [this.#room,...neighbours].map(async neighbour => {
                        await this.#onActiveChangeSrc(neighbour);
                    });
                } else {
                    this.applyPreviousSources();
                }

                const currentSrc = this.src;
                this.mazeObject.src = this.#previousSrc;
                this.#previousSrc = currentSrc;
                await this.draw(); 
                
            }
        });
    } 

    #prevSources; 

    async applyPreviousSources() {
        this.#prevSources.map(async source => {
            const room = this.#map.flatRooms.find(room => room.id === source.id);    
            if (room) {
                room.src = source.src;
                room.draw();
            }
        });
    }

    async #onActiveChangeSrc(room) {
        this.#prevSources.push({ id: room.id, src: room.src });
        // this.#prevSources.push({ id:  room.id, src: room.src});
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