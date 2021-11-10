import { Direction } from "../constants/direction.js";
import { Rotations } from "../constants/rotations.js";
import { MazeObjectMovable } from "./MazeObjectMovable.js";

class ArrowObject extends MazeObjectMovable {
    #maze;
    #name;
    #isHovered;
    #arrayPosition;

    constructor(mazeObject, maze, arrayPosition, index) {
        super(mazeObject);
        this.#maze = maze;
        this.#name = "Arrow " + index;
        this.#isHovered = false;
        this.#arrayPosition = arrayPosition;
        this.activateClickEvent();
        // this.activateHover();
    }

    hasIntersectActiveRoom() {
        // console.log(this.#maze.currentRoom.position.hasInsideX(this.position) || this.#maze.currentRoom.position.hasInsideY(this.position));
        return this.#maze.currentRoom.position.hasInsideX(this.position) || this.#maze.currentRoom.position.hasInsideY(this.position);
    }

    isLocatedCloseToActiveRoom() {
        const distance = this.#maze.currentRoom.position.distanceBetween(this.position);
        // console.log(distance, this.#maze.currentRoom.position, this.#maze.currentRoom.id);
        return distance.x < this.#maze.currentRoom.position.width
        && distance.y < this.#maze.currentRoom.position.height;
    }


    activateClickEvent() {
        this.#maze.canvas.addEventListener('click', e => {
            const isClickedX = this.startPoint.x < e.offsetX && this.endPoint.x > e.offsetX;
            const isClickedY = this.startPoint.y < e.offsetY && this.endPoint.y > e.offsetY;
            if (isClickedX && isClickedY && this.hasIntersectActiveRoom() && this.isLocatedCloseToActiveRoom()) {    
                const associateRotation = {
                    [Rotations.LEFT]: Direction.RIGHT,
                    [Rotations.RIGHT]: Direction.LEFT,
                    [Rotations.BOTTOM]: Direction.BOTTOM,
                    [Rotations.TOP]: Direction.TOP
                };

                this.#maze.changeCurrentMove(associateRotation[this.rotation], this.#arrayPosition);
            }
        });
    }

    activateHover() {
        this.#maze.canvas.addEventListener('mousemove', e => {
            const isClickedX = this.startPoint.x < e.offsetX && this.endPoint.x > e.offsetX;
            const isClickedY = this.startPoint.y < e.offsetY && this.endPoint.y > e.offsetY;
            if (isClickedX && isClickedY) {
                this.#maze.canvas.classList.remove('cursor-auto');
                this.#maze.canvas.classList.add('cursor-pointer');
                this.#isHovered = true;
            } else {
                const hasHovered = this.#maze.arrows.find(arrow => arrow.isHovered);
                console.log(hasHovered);
                if (hasHovered) {
                    this.#maze.canvas.classList.add('cursor-auto');
                    this.#maze.canvas.classList.remove('cursor-pointer');
                }
                this.#isHovered = false;
            } 

        });
    }

    get isHovered() {
        return this.#isHovered;
    }
}

export { ArrowObject };