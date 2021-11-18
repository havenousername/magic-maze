import { GameStage } from "../constants/game-stage.js";
import { Page } from "./Page.js";

class GameLoopPage extends Page {
    #game;
    #htmlIds;
    constructor(game) {
        super();
        this.#game = game;
    }

    render() {
        console.log('game loop here');
    }

    handle(request) {
        if (this.#game.stage === GameStage.GAME_LOOP) {
            return this.render();
        }

        return super.handle(request);
    }
}


export { GameLoopPage };