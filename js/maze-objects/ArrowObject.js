import { BaseConfig } from "../BaseConfig.js";
import { Direction } from "../constants/direction.js";
import { Rotations } from "../constants/rotations.js";
import { StepStage } from "../constants/step-stage.js";
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
    }

    hasIntersectActiveRoom() {
        return this.#maze.currentRoom.position.hasInsideX(this.position) || this.#maze.currentRoom.position.hasInsideY(this.position);
    }

    isLocatedCloseToActiveRoom() {
        const distance = this.#maze.currentRoom.position.distanceBetween(this.position);
        return distance.x < this.#maze.currentRoom.position.width
        && distance.y < this.#maze.currentRoom.position.height;
    }

    removeListeners() {
        this.#maze.canvas.removeEventListener('click', this.clickEvent);
    }

    clickEvent = e => {
        const allowEventExecution = BaseConfig
            .getInstance()
            .allowEventExecution(
                e, 
                this.startPoint, 
                this.endPoint, 
                this.hasIntersectActiveRoom() && this.isLocatedCloseToActiveRoom()
            );

        if (allowEventExecution && this.#maze.currentPlayer.stage === StepStage.SLIDE) {    
            const associateRotation = {
                [Rotations.LEFT]: Direction.RIGHT,
                [Rotations.RIGHT]: Direction.LEFT,
                [Rotations.BOTTOM]: Direction.BOTTOM,
                [Rotations.TOP]: Direction.TOP
            };

            // console.log(associateRotation[this.rotation], this.#arrayPosition);
            const changed = this.#maze.changeCurrentMove(associateRotation[this.rotation], this.#arrayPosition);
            if (changed) {
                this.#maze.currentPlayer.stage = StepStage.MOVE;
            }
        }
    }

    activateClickEvent() {
        this.#maze.canvas.addEventListener('click', this.clickEvent);
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