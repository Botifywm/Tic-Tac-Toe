//Module IIFE
const gameBoard = (function () {
    const dialog = document.querySelector('dialog');
    const p1Name = document.querySelector('#p1name').value;
    const p2Name = document.querySelector('#p2name').value;
    const closeSubmitName = document.querySelector('.submitName');
    const setupName = () => {
        dialog.showModal();
        closeSubmitName.addEventListener('click', (e) => {
            e.preventDefault();
            dialog.close();
        });
    };

    return {dialog, p1Name, p2Name, closeSubmitName, setupName};
})();

// factory to create players
function player (playerName, mark) {
    let name = playerName;
    let chosenCell = [];
    let score = 0;
    let marker = mark
    return {name, chosenCell, score, marker};
}

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



// main controller for the game
function gameController (playerOne = "Player One", playerTwo = "Player Two") {
    // create players
    const p1 = player(playerOne);
    const p2 = player(playerTwo);
    // p1.name = submitName().p1Name; 
    // p2.name = submitName().p2Name; 
    p1.marker = 'X';
    p2.marker = 'O';
    // const board = gameBoard().getBoard();

    //Submit players' name
    const submitName = () => {
        const p1 = document.querySelector('#p1name');
        const p2 = document.querySelector('#p2name');
        const submitName = document.querySelector('.submitName');
        submitName.addEventListener('click', () => {
            p1.name = p1.value; 
            p2.name = p2.value; 
        })
    }

    // start with player 1 first and switch turns
    let activePlayer = p1;

    const switchTurn = () => {
        activePlayer = activePlayer === p1 ? p2 : p1;
    }

    const getPlayer = () => activePlayer;

    // function to mark the players choice and store it
    const play = (cell) => {
        const choice = cell.getAttribute('data-value');
        getPlayer().chosenCell.push(choice);
    }

    // function to reset the game 
    const reset = () =>{
        p1.chosenCell = [];
        p2.chosenCell = [];
        const nodeList = document.querySelectorAll('.cell');
        nodeList.forEach((cell) => {
            cell.innerHTML = '';
        })
    }

    // Finally, this executes the logic flow
    const playRound = () => {
        gameBoard.setupName();
        const state = document.createElement('h2');
        const title = document.querySelector('h1');
        state.textContent = `${getPlayer().name} (${getPlayer().marker}) Starts`
        title.insertAdjacentElement("afterend", state);

        const cells = document.querySelectorAll('.cell');
        const arrayCells = Array.from(cells);
        cells.forEach((cell) => {
            cell.addEventListener('click', () => {
                if (cell.textContent === '') {
                    cell.textContent = getPlayer().marker;
                    play(cell);
                }
                switchTurn();
                if(checkWinner(p1.chosenCell).results !== 'T' &&
                checkWinner(p2.chosenCell).results !== 'T') {
                    if (arrayCells.every((cell) => cell.innerHTML !== '')){
                        state.textContent = `It's a Draw!`
                        return;
                    }
                    state.textContent = `${getPlayer().name}'s (${getPlayer().marker}) Turn`
                }
                else if (checkWinner(p1.chosenCell).results === 'T' ||
                checkWinner(p2.chosenCell).results === 'T'){
                    switchTurn();
                    state.textContent = `${getPlayer().name}'s Wins`
                }
            })
        })
        const resetbtn = document.querySelector('.reset');
        resetbtn.addEventListener('click', () => {
            reset();
        })
    }
    return {playRound, getPlayer, play};
}

const game = gameController().playRound;
game();








    // let board = [[1,2,3], [4,5,6], [7,8,9]];
    // const getBoard = () => board;
    // const printBoard = (board) => {
    //     for (let i = 0; i< board.length; i++){
    //         console.log(board[i]);
    //     }
    // }