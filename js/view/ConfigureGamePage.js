import { BaseConfig } from "../BaseConfig.js";
import { GameStage } from "../constants/game-stage.js";
import { Page } from "./Page.js";

class ConfigureGamePage extends Page {
    #game;
    #htmlIds;

    #playersNumber;
    #treasureNumber;
    #treasures;
    #players;

    constructor(game, htmlIds) {
        super();
        this.#game = game;
        this.#htmlIds = htmlIds ?? {
            wrapper: "configure-game",
            inputNumberOfPlayers: "number-of-players",
            inputNumberOfTreasures: "number-of-treasures",
            inputPlayer: "input-player",
            startGame: "configure-game-start-game",
            inputWrapper: "configure-input-wrapper",
            startGameBtn: "configure-start-game",
            goBackBtn: "configure-go-back"
        };

        this.#playersNumber = 2;
        this.#treasureNumber = 1;
        this.#players = ["king", "witch", "knight", "prince"]
        .map(i => ({ name: i,  src: `./assets/${i}.svg`, value: '' }));

        this.generateScreen();
    }

    get players() {
        return this.#players;
    }

    generatePlayersInput = () => {
        const createInputString = (player) => `
            <div class="flex flex-col relative">
                <span class="inline-block capitalize font-bold">${player.name}</span>
                <input 
                    id=${player.name} 
                    value="${player.value}" 
                    class="cfg-input bg-primary input-min-w bg-transparent border-primary border-4 pl-11 py-2 pr-2" 
                    placeholder="Please input ${player.name} name"
                /> 
                <img src="${player.src}" alt="${player.name}" width="19" class="absolute top-9 left-5" />
            <div>
        `;
        return this.#players.map((player, index) => this.#playersNumber < index + 1 ? '' : createInputString(player));
    };

    activateInputPlayerEventInput() {
        this.#players.map(player => {
            const playerInput = document.getElementById(player.name);
            if (playerInput) {
                playerInput.addEventListener('input', e => {
                    player.value = e.target.value;
                });
            }
        });
    }

    generateScreen() {
        const wrapperClass = 'w-full h-full absolute bg-image bg-center bg-cover flex justify-end items-end';
        const modalClass = 'w-full max-w-2xl h-full max-h-2xl p-6 rounded';

        const assocString = {
            header: "Choose Players",
            inputPlayersLabel: "Number of players",
            inputTreasuresLabel: "Number of treasures per player",
            startGameBtn: "Start game"
        }; 

        const elementText = `
            <div id="${this.#htmlIds.wrapper}" class="${wrapperClass}">
                <div id="${this.#htmlIds.goBackBtn}" class="absolute cursor-pointer left-11 top-11">
                    <img alt="goback" src="./assets/go-back-arrow.svg" width="30" />
                </div>
                <div class="${modalClass}">
                    <h1 class="text-4xl mt-9 mb-3 p-2 bg-primary rounded">${assocString.header}</h1>
                    <div class="mt-6">
                        <div class="flex flex-col font-bold ">
                            <span class="inline-block">${assocString.inputPlayersLabel}</span>
                            <input value="${this.#playersNumber}" id=${this.#htmlIds.inputNumberOfPlayers} type="number" min="2" max="4" class="cfg-input bg-primary pl-5 p-2 bg-transparent border-primary border-4" /> 
                        </div>
                        <div class="flex flex-col font-bold">
                            <span class="inline-block">${assocString.inputTreasuresLabel}</span>
                            <input value="${this.#treasureNumber}" id="${this.#htmlIds.inputNumberOfTreasures}" type="number" min="1" max="6" class="cfg-input bg-primary pl-5 p-2 bg-transparent border-primary border-4" /> 
                        </div>
                        <div id="${this.#htmlIds.inputWrapper}" class="flex flex-wrap justify-between">
                        </div>
                    </div>
                    <div class="flex justify-center mt-7">
                        <button id="${this.#htmlIds.startGameBtn}" class="btn-primary btn-small text-2xl bg-dark text-white border-primary border-4">${assocString.startGameBtn}</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertBefore(
            document.createElementFromString(elementText), 
            document.body.firstChild
        );
        this.createInputPlayers();

        document.getElementById(this.#htmlIds.wrapper).classList.add('hidden');

        document.getElementById(this.#htmlIds.inputNumberOfPlayers).addEventListener('input', e => {
            this.#playersNumber = +e.target.value;
            this.createInputPlayers();
        });

        document.getElementById(this.#htmlIds.startGameBtn).addEventListener('click', e => {
            const players = this.#players
                .map((player) => 
                    ({ src: player.src, name: player.value !== '' && player.value ? player.value : player.name }))
                .filter((_, ind) => ind + 1 <= this.#playersNumber);
            document.getElementById(this.#htmlIds.wrapper).classList.add('hidden');
            this.#game.players = players;
            this.#game.stage = GameStage.GAME_LOOP;
        });

        document.getElementById(this.#htmlIds.goBackBtn).addEventListener('click', () => {
            document.getElementById(this.#htmlIds.wrapper).classList.add('hidden');
            this.#game.stage = GameStage.MENU;
        });

        document.getElementById(this.#htmlIds.inputNumberOfTreasures).addEventListener('input', e => {
            this.#treasureNumber  = +e.target.value;
            this.#game.treasures = this.#playersNumber * this.#treasureNumber;
        });
    }

    createInputPlayers() {
        const inputWrapper = document.getElementById(this.#htmlIds.inputWrapper);
        inputWrapper.innerHTML = '';
        this.generatePlayersInput().map(input => {
            if (input === '') {
                return;
            }
            inputWrapper.appendChild(BaseConfig.getInstance().createElementFromString(input));    
        });
        this.activateInputPlayerEventInput();
    }

    render() {
        document.getElementById(this.#htmlIds.wrapper).classList.remove('hidden');
    }

    handle(request) {
        if (request.stage === GameStage.GAME_CONFIG) {
            return this.render();
        }

        return super.handle(request);
    }
}

export { ConfigureGamePage };