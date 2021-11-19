import { BaseConfig } from "../BaseConfig.js";
import { GameStage } from "../constants/game-stage.js";
import { Page } from "./Page.js";

class GameOverPage extends Page {
    #game;
    #winner;
    #time;
    #htmlIds;

    constructor(game) {
        super();
        this.#game = game;
        this.#htmlIds = {
            wrapper: "game-over-wrapper",
            startGameBtn: "game-over-start-btn",
            menuGameBtn: "game-over-menu-btn",
            winnerInfoPanel: "game-over-winner-info"
        }
        this.generateScreen();
    }

    generateScreen() {
        const wrapperClass = 'w-full h-full absolute bg-image bg-center bg-cover flex justify-center items-center z-10';
        const modalClass = "w-full z-10 max-w-2xl h-full bg-primary max-h-2xl p-6 border-primary border-4 flex flex-col items-center";
        const absoluteModalClass = "w-full left-0 absolute max-w-2xl h-full bg-primary max-h-2xl p-6 border-primary border-4 modal-absolute-decorative";

        const modalStrings = {
            header: "Game Over",
            startGameBtn: "New Game",
            menuGameBtn: "Menu",
        };

        const elementText = `
            <div id=${this.#htmlIds.wrapper} class="${wrapperClass}">
                <div class="${absoluteModalClass}"></div>
                <div class="${modalClass}">
                    <div class="flex justify-center mb-20">
                        <h1 class="text-4xl inline text-center font-bold border-b-4 border-primary">${modalStrings.header}</h1> 
                    </div>
                    <div id="${this.#htmlIds.winnerInfoPanel}"">
                    </div>
                    <div style="flex-basis: 60%" class="flex flex-col justify-evenly w-full items-center">
                        <button id="${this.#htmlIds.startGameBtn}" class="btn-primary btn-big text-3xl italic bg-dark text-white border-primary border-4">
                            ${modalStrings.startGameBtn}
                        </button>
                        <button id="${this.#htmlIds.menuGameBtn}" class="btn-primary btn-big text-3xl italic bg-dark text-white border-primary border-4">
                            ${modalStrings.menuGameBtn}
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertBefore(
            document.createElementFromString(elementText),
            document.body.firstChild,
        );

        document.getElementById(this.#htmlIds.wrapper).classList.add('hidden');


        document.getElementById(this.#htmlIds.startGameBtn).addEventListener('click', () => {
            document.getElementById(this.#htmlIds.wrapper).classList.add('hidden');
            this.#game.stage = GameStage.GAME_CONFIG;
        });

        document.getElementById(this.#htmlIds.menuGameBtn).addEventListener('click', () => {
            document.getElementById(this.#htmlIds.wrapper).classList.add('hidden');
            this.#game.stage = GameStage.MENU;
        });
    }

    render() {
        console.log('game over page');
        document.getElementById(this.#htmlIds.wrapper).classList.remove('hidden');
    }

    handle(request) {
        if (request.stage === GameStage.GAME_OVER) {
            return this.render();
        }

        return super.handle(request);
    }

    set winner(winner) {
        this.#winner = winner;
    }

    set time(time) {
        this.#time = time;

        const str = `
            <h4 class="text-xl">Well Done 
             <span class="text-secondary">${(this.#winner.name.capitalize())}</span>. 
             You won this game</h4>
            <h4 class="text-xl">Your time is ${BaseConfig.getInstance().formaTimeToMS(this.#time)}</h4>
        `;
        document
        .getElementById(this.#htmlIds.winnerInfoPanel).innerHTML = str;
    }
} 

export { GameOverPage };