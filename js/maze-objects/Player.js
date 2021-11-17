import { BaseConfig } from "../BaseConfig.js";
import { MazeObjectMovable } from "./MazeObjectMovable.js";

class Player extends MazeObjectMovable {
    #canvas;
    #name;
    #room;
    #previousSrc;
    #map;
    #roomSrc;
    #active;
    #prevSources; 

    constructor(mazeObject, name, positionLimit, canvas, room, map) {
        super(mazeObject, positionLimit);
        this.#canvas = canvas;
        this.#name = name;
        this.#room = room;
        this.#map = map;
        this.#roomSrc = BaseConfig.getInstance().parseNameFromSource(room.src);
        this.#previousSrc = this.src;
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
                    [...neighbours].map(async neighbour => {
                        await this.#onActiveChangeSrc(neighbour);
                    });
                    this.#previousSrc = this.#room.src;
                    this.#room.src =  './../assets/selected/' + this.#roomSrc + '.svg';
                } else {
                    this.applyPreviousSources();
                    this.#room.src =  './../assets/' + this.#roomSrc + '.svg';
                }   
                await this.#room.draw();     
                await this.draw();
            }
        });
    } 



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
        room.src = './../assets/steppable/' + BaseConfig.getInstance().parseNameFromSource(room.src) + '.svg';
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