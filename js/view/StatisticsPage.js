import { GameStage } from "../constants/game-stage.js";
import { Page } from "./Page.js";

class StatisticsPage extends Page {
    #game;
    #htmlIds;
    #statistics
    constructor(game) {
        super();
        this.#game = game;
        this.#htmlIds = {
            wrapper: 'statistics-page-wrapper',
            goBackBtn: 'statistics-go-back-btn'
        };
        this.#statistics = ["king", "witch", "knight", "prince"]
        .map((i, ind) => ({ name: i,  src: `./assets/${i}.svg`, place: ind + 1, time: '1.45 minutes' }))
        this.generateScreen();
    }

    generateScreen() {
        const wrapperClass = 'w-full h-full absolute bg-image bg-center bg-cover flex justify-center items-center';
        const modalClass = "w-full relative z-10 max-w-2xl h-full bg-primary max-h-2xl p-6 border-primary border-4 flex flex-col items-center";
        const absoluteModalClass = "w-full left-0 absolute max-w-2xl h-full bg-primary max-h-2xl p-6 border-primary border-4 modal-absolute-decorative";

        const modalStrings = {
            header: "Statistics"
        };

        const statisticsText = this.#statistics
            .reduce((prev, item) => prev + `
                <div class="flex py-3">
                    <h4 class="text-3xl italic border-b-4 border-primary">${item.place}</h4>
                    <img class="ml-8" src="${item.src}" alt="${item.name}" width="40"/>
                    <h4 class="text-3xl ml-8 capitalize italic">${item.name} - ${item.time}</h4>
                </div>
            `, '');

        const elementText = `
            <div id="${this.#htmlIds.wrapper}" class="${wrapperClass}">
                <div class="${absoluteModalClass}"></div>
                <div class="${modalClass}">
                    <div id="${this.#htmlIds.goBackBtn}" class="absolute cursor-pointer left-11">
                        <img alt="goback" src="./assets/go-back-arrow.svg" width="30" />
                    </div>
                    <div class="flex justify-center mb-20">
                        <h1 class="text-4xl inline text-center font-bold border-b-4 border-primary">${modalStrings.header}</h1> 
                    </div>
                    <div class="w-full px-11 py-6">
                        ${statisticsText}
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
        console.log('render statistics page');
        document.getElementById(this.#htmlIds.wrapper).classList.remove('hidden');
    }

    handle(request) {
        if ( request.stage === GameStage.STATISTICS) {
            return this.render(); 
        }

        return super.handle(request);
    }
}


export { StatisticsPage };