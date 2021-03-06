import { BaseConfig } from "./BaseConfig.js";
import { GameStage } from "./constants/game-stage.js"
import { ConfigureGamePage } from "./view/ConfigureGamePage.js";
import { GameLoopPage } from "./view/GameLoopPage.js";
import { GameOverPage } from "./view/GameOverPage.js";
import { MenuPage } from "./view/MenuPage.js";
import { StartPage } from "./view/StartPage.js";
import { StatisticsPage } from "./view/StatisticsPage.js";
import { InstructionsPage } from "./view/InstructionsPage.js";

class Game {
    #stage;
    #startPage;
    #menuPage;
    #configurePage;
    #statisticsPage;
    #gameLoop;
    #gameOver;
    #players;
    #gameCanvas;
    #treasures;
    #instructions;


    constructor(gameCanvas) {
        const startScreenDivIds = {
            wrapper: 'start-screen',
            menuBtn: 'start-screen-button-menu',
            gameBtn: 'start-screen-button-game',
        };
        this.#gameCanvas = gameCanvas;
        this.#treasures = BaseConfig.getInstance().getTreasuresSrc().filter((_, ind) => ind < 2);

        this.#startPage = new StartPage(this, startScreenDivIds);
        this.#menuPage = new MenuPage(this);
        this.#statisticsPage = new StatisticsPage(this);
        this.#configurePage = new ConfigureGamePage(this);
        this.#gameLoop = new GameLoopPage(this);
        this.#gameOver = new GameOverPage(this);
        this.#instructions = new InstructionsPage(this);

        this.initPages();
    }   

    initPages() {
        // TODO reset to start screen
        this.#stage = GameStage.START_SCREEN;
        this.#startPage.setNext(this.#menuPage);
        
        this.#menuPage.setNext(this.#statisticsPage);
        this.#menuPage.setNext(this.#configurePage);
        this.#menuPage.setNext(this.#instructions);

        this.#configurePage.setNext(this.#gameLoop);
        this.#gameLoop.setNext(this.#gameOver);

        this.#startPage.handle(this);

        // this.players = this.#configurePage.players;
    }
    
    get gameCanvas() {
        return this.#gameCanvas;
    }

    get stage() {
        return this.#stage;
    }

    set stage(stage) {
        this.#stage = stage;
        this.#startPage.handle(this);
    }

    get players() {
        return this.#players
    }

    set players(players) {
        this.#players = players;
        this.#gameLoop = new GameLoopPage(this);
        this.#gameLoop.initMaze();
    }

    get treasures() {
        return this.#treasures;
    }

    set treasures(treasuresLength) {
        this.#treasures = BaseConfig.getInstance().getTreasuresSrc().filter((_, ind) => ind < treasuresLength);
    }

    get gameOver() {
        return this.#gameOver;
    }

    set gameLoop(gameLoop) {
        this.gameLoop = gameLoop;
    }
}


export { Game };