//Module IIFE ***
const gameBoard = (function () {
    // NAME setup
    const dialog = document.querySelector('dialog');
    const p1Name = document.querySelector('#p1name');
    const p2Name = document.querySelector('#p2name');
    const closeSubmitName = document.querySelector('.submitName');
    const form = document.querySelector('.nameForm');
    const setupName = () => dialog.showModal();
    
    // TURN DESCRIPTION setup
    const state = document.createElement('h2');
    const title = document.querySelector('.heading');

    //TRACKER setup
    const scoreTrack = document.querySelector('.scoreTrack');
    const player1 = document.querySelector('.player1');
    const tie = document.querySelector('.tie');
    const player2 = document.querySelector('.player2');
    let tie_score = 0;
    const tieAccum = () => tie_score++;
    const getTie = () => tie_score;

    // BOARD CELLS
    const cells = document.querySelectorAll('.cell');
    const arrayCells = Array.from(cells);

    //RESET the game, score and name
    const resetbtn = document.querySelector('.resetBoard');
    const resetScoreBtn = document.querySelector('.resetScore');

    const resetBoard = (p1, p2) =>{
            p1.chosenCell = [];
            p2.chosenCell = [];
            const nodeList = document.querySelectorAll('.cell');
            nodeList.forEach((cell) => {
                cell.innerHTML = '';
            });
    };
    
    const resetScore = (p1, p2) => {
        p1.score = 0;
        p2.score = 0;
        tie_score = 0;
        player1.textContent = `${p1.name}: ${p1.score}`
        player2.textContent = `${p2.name}: ${p2.score}`
        tie.textContent = `Tie: ${getTie()}`
    }

    // MODAL Set up
    const winnerModal = document.querySelector('.winnerModal');
    const winnerModalContent = document.querySelector('.winnerModalContent');
    const replay = document.querySelector('.replay');
    const finish = document.querySelector('.finish');
    const restart = document.querySelector('.restart');
    const displayWinner = document.querySelector('.displayWinner');


    return {dialog, form, p1Name, p2Name, closeSubmitName, setupName, state, title,
        scoreTrack, player1, tie, player2, tieAccum, getTie, cells, arrayCells,
        resetBoard, resetScore, winnerModal, winnerModalContent, replay, finish,
        displayWinner, resetbtn, resetScoreBtn, restart};
})();

// FACTORY to create players ***
function player () {
    let name = "player";
    let chosenCell = [];
    let score = 0;
    let marker = ''
    return {name, chosenCell, score, marker};
}

// FACTORY to check winner ***
function checkWinner (chosenCell) {
    let results = "F"
    const array = chosenCell;
    array.sort();
    if (array.length >= 3) {
        console.log("whole array: " + array)
        arrayStr = array.toString();
        const patternOne = /[0-9,]*1,[0-9,]*2,[0-9,]*3[0-9,]*/
        const patternTwo = /[0-9,]*4,[0-9,]*5,[0-9,]*6[0-9,]*/
        const patternThree = /[0-9,]*7,[0-9,]*8,[0-9,]*9[0-9,]*/
        const patternFour = /[0-9,]*1,[0-9,]*5,[0-9,]*9[0-9,]*/
        const patternFive = /[0-9,]*1,[0-9,]*4,[0-9,]*7[0-9,]*/
        const patternSix = /[0-9,]*3,[0-9,]*6,[0-9,]*9[0-9,]*/
        const patternSeven = /[0-9,]*2,[0-9,]*5,[0-9,]*8[0-9,]*/
        const patternEight = /[0-9,]*3,[0-9,]*5,[0-9,]*7[0-9,]*/

        const patterns = [
            patternOne,
            patternTwo,
            patternThree,
            patternFour,
            patternFive,
            patternSix,
            patternSeven,
            patternEight
        ];
        
        for (let i = 0; i < patterns.length; i++) {
            if (patterns[i].test(arrayStr)){
                results = "T"
                break
            }
        }
    }
    return {results};
}


// GAME CONTROLLER ***
function gameController (playerOne = "Player One", playerTwo = "Player Two") {
    
    //START: Setting up local variables that can be accessed by playround function scope
    
    // Create players
    const p1 = player(playerOne);
    const p2 = player(playerTwo);
    p1.marker = 'X';
    p2.marker = 'O';

    // Start with player 1 first and switch turns
    let activePlayer = p1;
    let startTurn = p1;

    const switchTurn = () => {
        activePlayer = activePlayer === p1 ? p2 : p1;
    }

    // When players replay, the starting player will change
    const switchStartTurn = () => {
        startTurn = startTurn === p1 ? p2 : p1;
        activePlayer = startTurn;
    }

    const getPlayer = () => activePlayer;

    // Function to mark the players' choice/location and store it
    const play = (cell) => {
        const choice = cell.getAttribute('data-value');
        getPlayer().chosenCell.push(choice);
    }

    // END: Setting up local variables that can be accessed by playround function scope

    // Finally, this executes the logic flow of the game
    const playRound = () => {
        // Initial dialog form to get name inputs
        gameBoard.setupName();
        gameBoard.form.addEventListener('submit', (e) => {
            e.preventDefault();
            p1.name = gameBoard.p1Name.value;
            p2.name = gameBoard.p2Name.value;
            gameBoard.dialog.close();
            // Set up the board after getting the players' name
            gameBoard.state.textContent = `${getPlayer().name} starts (${getPlayer().marker})`;
            gameBoard.player1.textContent = `${p1.name}: ${p1.score}`
            gameBoard.player2.textContent = `${p2.name}: ${p2.score}`
            gameBoard.tie.textContent = `Tie: ${gameBoard.getTie()}`
        })
        gameBoard.title.insertAdjacentElement("afterend", gameBoard.state);

        // Mark the cells and check winner whenever a cell is clicked
        gameBoard.cells.forEach((cell) => {
            cell.addEventListener('click', () => {
                if (cell.textContent === '') {
                    cell.textContent = getPlayer().marker;
                    play(cell);
                    switchTurn();
                    if(checkWinner(p1.chosenCell).results !== 'T' &&
                    checkWinner(p2.chosenCell).results !== 'T') {
                        if (gameBoard.arrayCells.every((cell) => cell.innerHTML !== '')){
                            gameBoard.displayWinner.textContent = "It's a Draw!";
                            gameBoard.winnerModal.style.display = "block";
                            gameBoard.tieAccum();
                            gameBoard.tie.textContent = `Tie: ${gameBoard.getTie()}`
                        }
                        gameBoard.state.textContent = `${getPlayer().name}'s Turn (${getPlayer().marker})`
                    }
                    else if (checkWinner(p1.chosenCell).results === 'T' ||
                    checkWinner(p2.chosenCell).results === 'T'){
                        switchTurn();
                        gameBoard.displayWinner.textContent = `${getPlayer().name} Wins!`
                        gameBoard.winnerModal.style.display = "block";
                        getPlayer().score++;
                        if(getPlayer().name === p1.name){
                            gameBoard.player1.textContent = `${p1.name}: ${p1.score}`;
                        }
                        else {
                            gameBoard.player2.textContent = `${p2.name}: ${p2.score}`;
                        }
                    }
                }
            })
        })
        // RESETTING

        // 1) Board
        gameBoard.resetbtn.addEventListener('click', () => {
            gameBoard.resetBoard(p1, p2);
        })
        // 2) Scores
        gameBoard.resetScoreBtn.addEventListener('click', () => {
            gameBoard.resetScore(p1, p2)
        })
        // 3) Replay
        gameBoard.replay.addEventListener('click', () => {
            gameBoard.resetBoard(p1, p2);
            gameBoard.winnerModal.style.display = "none";
            switchStartTurn();
            gameBoard.state.textContent = `${getPlayer().name} starts (${getPlayer().marker})`;
        })
        // 4) Conclude the game
        gameBoard.finish.addEventListener('click', () => {
            gameBoard.replay.classList.add("disable");
            if (p1.score > p2.score){
                gameBoard.displayWinner.textContent = `${p1.name} is the Final Winner!`;
            }
            else if (p1.score < p2.score){
                gameBoard.displayWinner.textContent = `${p2.name} is the Final Winner!`;
            }
            else {
                gameBoard.displayWinner.textContent = `It's a Draw! Both are the Final Winners!`;
            }
        })
        // 5) Restart the whole game (players remain the same)
        gameBoard.restart.addEventListener('click', () => {
            gameBoard.resetBoard(p1, p2);
            gameBoard.resetScore(p1, p2);
            gameBoard.winnerModal.style.display = "none";
            gameBoard.replay.classList.remove("disable");
        })
    }

    return {playRound};
}

const game = gameController().playRound;
game();
