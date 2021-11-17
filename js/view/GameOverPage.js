import { GameStage } from "../constants/game-stage.js";
import { Page } from "./Page.js";

class GameOverPage extends Page {
    #game;
    constructor(game) {
        super();
        this.#game = game;
    }
    render() {
        console.log('game over page');
    }

    handle(request) {
        if (request.stage === GameStage.GAME_OVER) {
            return this.render();
        }

        return super.handle(request);
    }
} 

export { GameOverPage };