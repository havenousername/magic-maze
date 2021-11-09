import { MazeObject } from "./MazeObject.js";


class MazeRoom extends MazeObject {
    constructor({ src, position, canvasContext, rotation }) {
        super({ src, position, canvasContext, rotation });
    }
}


export { MazeRoom };