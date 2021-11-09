import { MazeObject } from "./MazeObject";


class MazeRoom extends MazeObject {
    constructor({ src, position, canvasContext }) {
        super({ src, position, canvasContext });
    }
}


export { MazeRoom };