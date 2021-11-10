import { Maze } from "./Maze.js";

document.addEventListener('DOMContentLoaded', () => {
    const imagesSources = ['../assets/room.svg', '../assets/bend-room.svg', '../assets/t-room.svg'];
    const maze = new Maze('game-canvas', imagesSources);
});