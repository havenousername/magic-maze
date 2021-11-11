import { Rotations } from "./constants/rotations.js";

const BaseConfig = (function() {
    let instance;

    function init() {
        if (instance) {
            return instance;
        }

        // private methods and variables

        let srcImages = ['../assets/room.svg', '../assets/bend-room.svg', '../assets/t-room.svg'];
        let mazeCanvasSize = 512;
        let offsetMazeCanvasSize = 150;
        let mazeSize = 7;
        let mazeFixedRooms = [
            [
                {rotation: Rotations.BOTTOM, src: 1}, 
                {rotation: Rotations.BOTTOM, src: 2}, 
                {rotation: Rotations.BOTTOM, src: 2},
                {rotation: Rotations.RIGHT, src: 1}
            ],
            [
                {rotation: Rotations.LEFT, src: 2}, 
                {rotation: Rotations.LEFT, src: 2}, 
                {rotation: Rotations.BOTTOM, src: 2}, 
                {rotation: Rotations.RIGHT, src: 2}
            ],
            [
                {rotation: Rotations.LEFT, src: 2}, 
                {rotation: Rotations.TOP, src: 2}, 
                {rotation: Rotations.RIGHT, src: 2}, 
                {rotation: Rotations.RIGHT, src: 2}
            ],
            [
                {rotation: Rotations.LEFT, src: 1}, 
                {rotation: Rotations.TOP, src: 2}, 
                {rotation: Rotations.TOP, src: 2}, 
                {rotation: Rotations.TOP, src: 1}
            ]
        ];  

        let rotations = [Rotations.BOTTOM, Rotations.RIGHT, Rotations.TOP, Rotations.LEFT];

        instance = this;

        // public methods and variables
        return {
            getSrcImages: function() {
                return srcImages;
            },
            getMazeCanvasSize: function() {
                return mazeCanvasSize;
            },
            getMazeSize() {
                return mazeSize;
            },
            getOffsetMazeCanvasSize() {
                return offsetMazeCanvasSize;
            },
            getMazeFixedRooms() {
                return mazeFixedRooms;
            },
            getRotations() {
                return rotations;
            },
            getStandardRoomSrc() {
                return srcImages[0];
            },
            getTRoomSrc() {
                return srcImages[2];
            },
            getBendRoomSrc() {
                return srcImages[1];
            }
        }
    }

    return {
        getInstance: function() {
            if (!instance) {
                instance = init(); 
            }

            return instance;
        }
    }
}());

export { BaseConfig };