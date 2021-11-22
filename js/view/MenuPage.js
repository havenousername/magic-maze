import { GameStage } from "../constants/game-stage.js";
import { Page } from "./Page.js";

class MenuPage extends Page {
    #game;
    #htmlIds;
    constructor(game) {
        super();
        this.#game = game;
        this.#htmlIds = {
            wrapper: "menu-page-wrapper",
            startGameBtn: "menu-page-game-start-btn",
            statisticsBtn: "menu-page-statistics-btn",
            electiveBtn: "menu-page-instructions",
        };
        this.generateScreen();
    }

    generateScreen() {
        const wrapperClass = 'w-full h-full absolute bg-image bg-center bg-cover flex justify-center items-center';
        const modalClass = "w-full z-10 max-w-2xl h-full bg-primary max-h-2xl p-6 border-primary border-4 flex flex-col items-center";
        const absoluteModalClass = "w-full left-0 absolute max-w-2xl h-full bg-primary max-h-2xl p-6 border-primary border-4 modal-absolute-decorative";

        const modalStrings = {
            header: "Menu",
            startGameBtn: "New Game",
            statisticsBtn: "Statistics",
            electiveBtn: "Learn more about this Game Rules"
        };

        const elementText = `
            <div id=${this.#htmlIds.wrapper} class="${wrapperClass}">
                <div class="${absoluteModalClass}"></div>
                <div class="${modalClass}">
                    <div class="flex justify-center mb-20">
                        <h1 class="text-4xl inline text-center font-bold border-b-4 border-primary">${modalStrings.header}</h1> 
                    </div>
                    <div style="flex-basis: 60%" class="flex flex-col justify-evenly w-full items-center">
                        <button id="${this.#htmlIds.startGameBtn}" class="btn-primary btn-big text-3xl italic bg-dark text-white border-primary border-4">
                            ${modalStrings.startGameBtn}
                        </button>
                        <button id="${this.#htmlIds.statisticsBtn}" class="btn-primary btn-big text-3xl italic bg-dark text-white border-primary border-4">
                            ${modalStrings.statisticsBtn}
                        </button>
                    </div>
                    <div style="max-width: 21.875rem;" class="w-full">
                        <button id="${this.#htmlIds.electiveBtn}" class="italic border-b-4 border-secondary">${modalStrings.electiveBtn}</button>
                    <div>
                    
                </div>
            </div>
        `;

        document.body.insertBefore(
            document.createElementFromString(elementText),
            document.body.firstChild,
        );

        document.getElementById(this.#htmlIds.wrapper).classList.add('hidden');

        document.getElementById(this.#htmlIds.startGameBtn).addEventListener('click', e => {
            document.getElementById(this.#htmlIds.wrapper).classList.add('hidden');
            this.#game.stage = GameStage.GAME_CONFIG;
        });

        document.getElementById(this.#htmlIds.statisticsBtn).addEventListener('click', () => {
            document.getElementById(this.#htmlIds.wrapper).classList.add('hidden');
            this.#game.stage = GameStage.STATISTICS;
        });

        document.getElementById(this.#htmlIds.electiveBtn).addEventListener('click', () => {
            document.getElementById(this.#htmlIds.wrapper).classList.add('hidden');
            this.#game.stage = GameStage.INSTRUCTIONS;
        })
    }

    render() {
        document.getElementById(this.#htmlIds.wrapper).classList.remove('hidden');
    }

    handle(request) {
        if (request.stage === GameStage.MENU) {
            return this.render();
        } 

        return super.handle(request);
    }
}


export { MenuPage };