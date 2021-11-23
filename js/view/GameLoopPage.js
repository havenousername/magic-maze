import { GameStage } from "../constants/game-stage.js";
import { Page } from "./Page.js";
import { Maze } from "../Maze.js";
import { BaseConfig } from "../BaseConfig.js";

class GameLoopPage extends Page {
    static startMarkertSrc = `${BaseConfig.getInstance().getCurrentPath()}/assets/route-start.svg`;
    
    #parentId
    #game;
    #htmlIds;
    #maze;
    #timeBegin;
    #time;
    #diff;
    #gameOver;
    #generatedStats;
    

    constructor(game, parentId = 'content') {
        super();
        this.#game = game;
        this.#htmlIds = {
            wrapper: "gameloop-controls-panel-wrapper",
            goBackBtn: 'gomeloop-go-back-btn',
            stopWatch: "gameloop-stopwatch",
            movePlayer: "gameloop-move-player",
            pause: "gameloop-pause-btn",
            stats: "game-loop-players-stat-wrapper",
            gameLoop: "gameloop"
        };
        this.generateControlPanel();
        this.#timeBegin = new Date().getTime();
        this.diff = new Date().getTime();
        this.#gameOver = false;
        this.#parentId = parentId;
        this.#generatedStats = false;
    }

    #gameCallback = () => {
        this.#renderStopWatch();
        if (!this.#gameOver) {
            window.requestAnimationFrame(this.#gameCallback);
        }
    }

    changeCurrentPlayer(player) {
        if (!player) return;
        let playerMoveElem = document.getElementById(this.#htmlIds.movePlayer);
        if (!playerMoveElem) return;
        playerMoveElem.innerHTML = player.name;

        if (this.#maze.winner) {
            this.#goToGameOver(this.#maze.winner);
            return;
        }
        
        if (!this.#generatedStats) {
            this.generatePlayersStats(this.#maze.players);
        }
        this.#maze.players.map(pl => this.#changePlayerView(pl));        
    }

    #goToGameOver(winner) {
        console.log(winner);
        this.#game.gameOver.winner = winner;
        this.#game.gameOver.time = this.#diff;
        this.#game.stage = GameStage.GAME_OVER;
        this.#gameOver = true;
        this.#resetDocument();
    }

    // TODO check later object removal
    #resetDocument() {
        this.#maze.destroy();
        document.getElementById(this.#htmlIds.wrapper).remove();
        document.getElementById(this.#htmlIds.stats).remove();
    }

    
    #changePlayerView(player) {
        const treasuresLeftElem = document.getElementById(`${this.#htmlIds.gameLoop}-${player.name}-left`);
        treasuresLeftElem.innerHTML = player.treasuresLeft;

        const playerScoreElem = document.getElementById(`${this.#htmlIds.gameLoop}-${player.name}-score`);
        playerScoreElem.innerHTML = player.score;

        const treasureImage = document.getElementById(`${this.#htmlIds.gameLoop}-${player.name}-treasure`);
        if (player.huntedTreasure) {
            treasureImage.src = player.huntedTreasure.src;
        }  else {
            treasureImage.src = GameLoopPage.startMarkertSrc;
            const leftElemText = treasuresLeftElem.parentElement.children;
            leftElemText[0].innerHTML = "Go to initial position";
            leftElemText[1].innerHTML = "";
        }
        
    }

    generateControlPanel() {
        const infoPanelText = `
            <div id="${this.#htmlIds.wrapper}" class="w-full pt-4 bg-red flex justify-between">
                <div class="flex flex-grow">
                    <div id="${this.#htmlIds.goBackBtn}" class="z-10 cursor-pointer flex items-center ml-11 mr-8">
                        <img alt="goback" src="${BaseConfig.getInstance().getCurrentPath()}/assets/go-back-arrow.svg" width="30" />
                    </div>
                    <div class="flex flex-col mr-8 z-10">
                        <h5 class="text-xl text-white">time</h5>
                        <h3 class="text-2xl text-white font-bold" id="${this.#htmlIds.stopWatch}"><h3>
                    </div>
                    <div class="flex flex-col z-10">
                        <h5 class="text-xl text-white">move</h5>
                        <h3 class="text-2xl text-white font-bold capitalize" id="${this.#htmlIds.movePlayer}"><h3>
                    </div>
                </div>
                <div style="flex-basis: 15%" class="flex items-center">
                    <button id="${this.#htmlIds.pause}" class="text-white text-2xl btn-secondary inline">Pause</button> 
                </div>
            </div>
         `;

         document.body.insertBefore(
            document.createElementFromString(infoPanelText),
            document.body.firstChild,
        );

        document.getElementById(this.#htmlIds.wrapper).classList.add('hidden');


        document.getElementById(this.#htmlIds.goBackBtn).addEventListener('click', () => {
            this.#game.stage = GameStage.GAME_CONFIG;
            this.#resetDocument();
        });
    }

    generatePlayersStats(players) {
        if (players.length === 0) {
            return;
        }

        let playerStats = players.map(player =>{ 
            // console.log(player.huntedTreasure.src)
            return `
            <div id="${player.name}-wrapper" class="treasure-wrapper py-2">
                <div class="flex justify-between pb-3">
                    <div class="flex">
                        <img src="${player.src}" alt="${player.name}" width="33" />
                        <h4 class="text-2xl text-white capitalize">${player.name}</h4>
                    </div>
                    <h4 class="text-2xl text-white" id="${this.#htmlIds.gameLoop}-${player.name}-score">${player.score}</h4>
                </div>
                <div class="treasure-card flex justify-center align-center">
                    <img 
                        id="${this.#htmlIds.gameLoop}-${player.name}-treasure" 
                        src="${player.huntedTreasure.src}" 
                        alt="${player.name}-treasure" 
                        width="50" 
                    />
                </div>
                <div class="flex justify-between">
                    <h4 class="text-xl text-white">Treasures left</h4>
                    <h4 class="text-xl text-white" id="${this.#htmlIds.gameLoop}-${player.name}-left">${player.treasuresLeft}</h4>
                </div>
            </div>
        `}).join(' ');

        playerStats = `
            <div id="${this.#htmlIds.stats}" class="flex flex-col justify-around">
                ${playerStats}
            </div>
        `;
        document.getElementById(this.#parentId).appendChild(document.createElementFromString(playerStats));
        this.#generatedStats = true;
    }

    #createFormattedTime(diff) {
        return BaseConfig.getInstance().formaTimeToMS(diff);
    }

    #renderStopWatch() {
        const now = new Date().getTime();
        const diff = now - this.#timeBegin;
        this.#diff = diff;
        document.getElementById(this.#htmlIds.stopWatch).innerHTML = this.#createFormattedTime(diff);
    }

    render() {
        window.requestAnimationFrame(this.#gameCallback);
        document.getElementById(this.#htmlIds.wrapper).classList.remove('hidden');
    }

    handle(request) {
        if (this.#game.stage === GameStage.GAME_LOOP) {
            return true;
        }

        return super.handle(request);
    }

    initMaze() {
        this.#maze = new Maze(this.#game.gameCanvas, this.#game.players, this.#game.treasures, this);
        this.#time = new Date();
        this.render();

    
        if (!document.getElementById(this.#htmlIds.stats)) {
            this.generatePlayersStats(this.#maze.players);
        } else {
            document.getElementById(this.#htmlIds.stats).classList.remove('hidden');
        }
        
    }
}


export { GameLoopPage };