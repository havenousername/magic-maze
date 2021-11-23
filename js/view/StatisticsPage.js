import { GameStage } from "../constants/game-stage.js";
import { Page } from "./Page.js";
import { BaseConfig } from "../BaseConfig.js";

class StatisticsPage extends Page {
    #game;
    #htmlIds;
    #statistics;
    constructor(game) {
        super();
        this.#game = game;
        this.#htmlIds = {
            wrapper: 'statistics-page-wrapper',
            goBackBtn: 'statistics-go-back-btn',
            statsWrapper: 'statistics-stats',
        };
        this.#statistics = ["king", "witch", "knight", "prince"]
        .map((i, ind) => ({ name: i,  src: `${BaseConfig.getInstance().getCurrentPath()}/assets/${i}.svg`, place: ind + 1, time: '1.45 minutes' }))
        this.generateScreen();
    }

    statisticsText = () => this.#statistics
            .reduce((prev, item) => prev + `
                <div class="flex py-3">
                    <h4 class="text-3xl italic border-b-4 border-primary">${item.place}</h4>
                    <img class="ml-8" src="${item.src}" alt="${item.name}" width="40"/>
                    <h4 class="text-3xl ml-8 capitalize italic">${item.name} - ${item.time}</h4>
                </div>
            `, '');

    generateScreen() {
        const wrapperClass = 'w-full h-full absolute bg-image bg-center bg-cover flex justify-center items-center';
        const modalClass = "w-full relative z-10 max-w-2xl h-full bg-primary max-h-2xl p-6 border-primary border-4 flex flex-col items-center";
        const absoluteModalClass = "w-full left-0 absolute max-w-2xl h-full bg-primary max-h-2xl p-6 border-primary border-4 modal-absolute-decorative";

        const modalStrings = {
            header: "Statistics"
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
                        ${this.statisticsText()}
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
        const prevLocalStorage = JSON.parse(localStorage.getItem(BaseConfig.getInstance().getStatisticsLocalstorageName())) ?? [];
        this.#statistics = prevLocalStorage.sort((a, b) => a.time < b.time ? -1 : 1).map((i, ind) => ({...i, place: ind + 1}));
        document.getElementById(this.#htmlIds.statsWrapper).innerHTML = this.statisticsText(); 
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