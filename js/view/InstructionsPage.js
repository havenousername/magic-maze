import { Page } from "./Page.js";
import { GameStage } from "../constants/game-stage.js";
import { BaseConfig } from "../BaseConfig.js";

class InstructionsPage extends Page {
    #game;
    #htmlIds;
    constructor(game) {
        super();
        this.#game = game;
        this.#htmlIds = {
            wrapper: 'instructions-page-wrapper',
            goBackBtn: 'instructions-go-back-btn',
        };
        this.generateScreen();
    }

    generateScreen() {
        const wrapperClass = 'w-full h-full absolute bg-image bg-center bg-cover flex justify-center items-center';
        const modalClass = "w-full relative z-10 max-w-2xl h-full bg-primary max-h-2xl p-6 border-primary border-4 flex flex-col items-center overflow-y-scroll";
        const absoluteModalClass = "w-full left-0 absolute max-w-2xl h-full bg-primary max-h-2xl p-6 border-primary border-4 modal-absolute-decorative";

        const modalStrings = {
            header: "How to play the game?"
        };

        const elementText = `
            <div id="${this.#htmlIds.wrapper}" class="${wrapperClass}">
                <div class="${absoluteModalClass}"></div>
                <div class="${modalClass}">
                    <div id="${this.#htmlIds.goBackBtn}" class="absolute cursor-pointer left-11">
                        <img alt="goback" src="${BaseConfig.getInstance().getCurrentPath()}/assets/go-back-arrow.svg" width="30" />
                    </div>
                    <div class="flex justify-center mb-20">
                        <h1 class="text-4xl inline text-center font-bold border-b-4 border-primary">${modalStrings.header}</h1> 
                    </div>
                    <div class="w-full px-11 py-6" id="${this.#htmlIds.statsWrapper}">
                        <p class="my-4"> 
                        The rooms int maze are symbolized by a 7x7 square grid cells. For each room we know that which wall has a door. If there are two doors in the contact wall of two neighbouring rooms, you can go from one room to another. The even rows and columns in the grid can be slided, the other rooms are fixed throughout the game. By sliding the rooms in the grid, doors and passages open through which players can move in the maze. By cleverly sliding the rooms players try to find their way to the treasures. The first player to find all their treasures and return to the starting square is the winner.
                        </p>
                        <p>
                        During the game each player has to find his/her revealed treasure card (that can be seen by others). The player tries to get to the room showing the same treasure as on this card. For this the player needs to
                        </p>
                        <ol class="my-4 list-decimal">
                            <li>move the maze, and after that</li>
                            <li>move the playing piece.</li>
                        </ol>
                        <p class="my-4">
                        Moving the maze is done as follows: the player inserts the extra room into the game board where one of the arrows shows the slidable rows and columns, until another room is pushed out of the maze on the opposite side. The only exception: The room cannot be inserted back into the board at the same place where it was pushed out. So you cannot undo the previous player's move. If the room you push out has a playing piece on it, put this piece on the opposite side of the board on the room that was just placed. The treasures always move with the rooms.
                            Once you have moved the maze, you can move your playing piece. You can occupy any square that you can move your piece to directly, without interruption. You can move your playing piece as far as you like. Or, you can leave your playing piece where it is. There can be more than one playing piece in one room: playing pieces do not hit each other. If you are unable to get to the treasure you are searching for, you can move your playing piece into a position that gives you a good starting point for your next turn. Once you find the treasure you are looking for, reveal your next treasure card. On your next turn, find your way to this treasure on the game board.
                            Now it’s the next player’s turn. This player inserts the extra room into the game board before moving their playing piece, and so on.
                        </p>

                        <p class="my-4">
                        The game is over as soon as a player has found all their treasure cards and returned their playing piece to its starting position. The first player to do this is the winner.
                        </p>
                    </div>
                </div>
            </div>
        `;

        document.body.insertBefore(
            document.createElementFromString(elementText),
            document.body.firstChild,
        );

        document.getElementById(this.#htmlIds.wrapper).classList.add('hidden');

        document.getElementById(this.#htmlIds.goBackBtn).addEventListener('click', () => {
            document.getElementById(this.#htmlIds.wrapper).classList.add('hidden');
            this.#game.stage = GameStage.MENU;
        });
    }

    render() {
        document.getElementById(this.#htmlIds.wrapper).classList.remove('hidden');
    }

    handle(request) {
        if ( request.stage === GameStage.INSTRUCTIONS) {
            return this.render(); 
        }

        return super.handle(request);
    }
}


export { InstructionsPage };