import { MazeObjectMovable } from "./MazeObjectMovable.js";

class Treasure extends MazeObjectMovable {
    static HEIGHT = 20;
    static WIDTH = 20;
    #player
    #room
    #isCollected
    #isHunted
    #points

    constructor(mazeObject, { room, isHunted, player }) {
        super(mazeObject);
        this.#room = room;
        this.#isCollected = false;
        this.#isHunted = isHunted ?? false;
        this.#player = player;
        this.#points = 100;
        this.#room.addTreasure(this);
        this.#player.associateTreasure(this);
    }

    async moveToRoom() {
        await this.move(this.#room.center.x - Treasure.WIDTH / 2, this.#room.center.y - Treasure.HEIGHT /2);
    }

    makeHuntable() {
        this.#isHunted = true;
    }

    collect() {
        this.#isCollected = true;
        this.#isHunted = false;
        this.#room.removeTreasure();
    }

    get points() {
        return this.#points;
    }

    get player() {
        return this.#player;
    }

    get isHunted() {
        return this.#isHunted;
    }

    get isCollected() {
        return this.#isCollected;
    }
}


export { Treasure };