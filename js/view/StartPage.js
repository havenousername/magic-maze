import { GameStage } from "../constants/game-stage.js";
import { Page } from "./Page.js";

class StartPage extends Page {
    #startScreenDivIds;
    #game;

    constructor(game, startDiv) {
        super();
        this.#startScreenDivIds = {
            wrapper: startDiv.wrapper,
            menuBtn: startDiv.menuBtn,
            gameBtn: startDiv.gameBtn,
        };
        this.#game = game;
        this.generateScreen();
    }

    generateScreen() {
        const wrapperClass = 'w-full h-full absolute bg-image bg-center bg-cover flex justify-end items-end';
        const modalClass = 'w-full max-w-2xl h-full max-h-2xl p-6 rounded';
        const modalStrings = {
            header: "Maze game",
            subheader: "Find your treasure",
            button: "Start",
            buttonTop: "Menu"
        };

        const elementText = `
            <div id="${this.#startScreenDivIds.wrapper}" class="${wrapperClass}">
                <div class="${modalClass}">
                    <div class="flex flex-col">
                        <button id="${this.#startScreenDivIds.menuBtn}" class="text-white text-4xl btn-secondary inline">${modalStrings.buttonTop}</button>
                        <h1 class="font-game text-7xl mt-6 mb-3">
                            <span class="text-white">${modalStrings.header.split(' ')[0]}</span>
                            <span class="text-dark">${modalStrings.header.split(' ')[1]}</span>
                        </h1>
                        <h3 class="text-white italic font-normal text-4xl mb-6">${modalStrings.subheader}</h3>
                        <button id="${this.#startScreenDivIds.gameBtn}" class="btn-primary btn-big text-5xl bg-dark text-white border-primary border-8">${modalStrings.button}</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertBefore(
            document.createElementFromString(elementText), 
            document.body.firstChild
        );

        const startScreenDivId = this.#startScreenDivIds; 

        document.getElementById(startScreenDivId.wrapper).classList.add('hidden');

        document.getElementById(startScreenDivId.menuBtn).addEventListener('click', () => {
            document.getElementById(startScreenDivId.wrapper).classList.add('hidden');
            this.#game.stage = GameStage.MENU;
        });

        document.getElementById(startScreenDivId.gameBtn).addEventListener('click', () => {
            document.getElementById(startScreenDivId.wrapper).classList.add('hidden');
            this.#game.stage = GameStage.GAME_CONFIG;
        });
    }

    render(request) {
        console.log('render start page');
        document.getElementById(this.#startScreenDivIds.wrapper).classList.remove('hidden');
    }

    handle(request) {
        if ( request.stage === GameStage.START_SCREEN) {
            return this.render(request);
        }

        return super.handle(request);
    }
}

export { StartPage };