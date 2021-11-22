import { Rotations } from "./constants/rotations.js";

const BaseConfig = (function() {
    let instance;

    function init() {
        if (instance) {
            return instance;
        }

        // private methods and variables

        let srcImages = ['../assets/room.svg', '../assets/bend-room.svg', '../assets/t-room.svg'];
        const treasuresSrc = [
            "ball.svg",
            "bomb.svg",
            "cards.svg",
            "cat.svg",
            "chest.svg",
            "crown.svg",
            "devil.svg",
            "diamond.svg",
            "dice.svg",
            "flag.svg",
            "game-controller.svg",
            "gasoline.svg",
            "gun.svg",
            "logo.svg",
            "map.svg",
            "monster.svg",
            "mushroom.svg",
            "puzzle.svg",
            "shield.svg",
            "strategy.svg",
            "target.svg",
            "ufo.svg",
            "vr.svg",
            "wizard.svg"
        ].map(treasure => `../assets/treasures/${treasure}`);


        const STATISTICS_STORAGE = 'maze-game-statisctics'


        let mazeCanvasSize = 512;
        let offsetMazeCanvasSize = 150;
        let mazeSize = 7;
        let mazeFixedRooms = [
            [
                {rotation: Rotations.BOTTOM, src: 1}, 
                {rotation: Rotations.BOTTOM, src: 2}, 
                {rotation: Rotations.BOTTOM, src: 2},
                {rotation: Rotations.LEFT, src: 1}
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
                {rotation: Rotations.RIGHT, src: 1}, 
                {rotation: Rotations.TOP, src: 2}, 
                {rotation: Rotations.TOP, src: 2}, 
                {rotation: Rotations.TOP, src: 1}
            ]
        ];  

        let rotations = [Rotations.BOTTOM, Rotations.RIGHT, Rotations.TOP, Rotations.LEFT];

        const createImagePath = (src) => '../assets/' + src + '.svg'; 

        function createElementFromString(str) {
            const element = new DOMParser().parseFromString(str, 'text/html');
            const child = element.documentElement.querySelector('body').firstChild;
            return child;
         };

         Object.defineProperty(String.prototype, 'capitalize', {
            value: function() {
              return this.charAt(0).toUpperCase() + this.slice(1);
            },
            enumerable: false
          });

        Document.prototype.createElementFromString = createElementFromString;
        let playersSrc = {
            king: createImagePath('king'),
            knight: createImagePath('knight'),
            primce: createImagePath('prince'),
            witch: createImagePath('witch'),
        }

        instance = this;

        // public methods and variables
        return {
            createElementFromString(str) {
                return createElementFromString(str);
            },
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
            },
            getPlayersSrc() {
                return playersSrc;
            },
            allowEventExecution: (e, startPoint, endPoint, condition = true) => {
                const isClickedX = startPoint.x < e.offsetX && endPoint.x > e.offsetX;
                const isClickedY = startPoint.y < e.offsetY && endPoint.y > e.offsetY;
    
                return isClickedX && isClickedY && condition;
            },
            parseNameFromSource(src) {
                return src.split('assets/')[1].split('.')[0];
            },
            takeSelectedSrc(src) {
                return createImagePath(this.parseNameFromSource(src) + '-selected');
            },
            formaTimeToMS(diff) {
                const seconds = Math.round((diff / 1000) % 59);
                const minutes = Math.round(diff / (1000 * 60));
                const hasMinutes = minutes > 0;

                return `${hasMinutes ? minutes : '00'}:${seconds < 10 ? `0${seconds}` : seconds}`;
            },
            getTreasuresSrc() {
                return treasuresSrc;
            },
            getStatisticsLocalstorageName() {
                return STATISTICS_STORAGE;
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

export { BaseConfig  };