import { MazeObject } from "./maze-objects/MazeObject.js";
import { Maze } from "./Maze.js";
import { Position } from "./util/Position.js";

document.addEventListener('DOMContentLoaded', () => {
    const position = new Position(12, 12);
    const imagesSources = ['../assets/room.svg', '../assets/bend-room.svg', '../assets/t-room.svg'];
    const maze = new Maze('game-canvas', imagesSources);

    // const mazeObject = new MazeBoject('', position);

    // console.log(mazeObject);
});