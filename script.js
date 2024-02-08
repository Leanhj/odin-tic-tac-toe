function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const legalMove = (row, column) => {
        let selectedCell = board[row][column];
        if (selectedCell.getValue() === 0) {
            return true;
        } else {
            return false;
        }
    }

    const makeMove = (row, column, player) => {
        let selectedCell = board[row][column];
        selectedCell.addToken(player);
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) =>
        row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

    return {
        getBoard,
        legalMove,
        makeMove,
        printBoard
    };
}

function Cell() {
    let value = 0;

    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        addToken,
        getValue
    };
}

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            token: 1
        },
        {
            name: playerTwoName,
            token: 2
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    let turns = 0;
    const getTurns = () => turns;

    const increaseTurns = () => turns++;

    const checkWin = () => {
        let tempBoard = board.getBoard();

        let rowSums = [];

        for (let i = 0; i < 3; i++) {
            let rowSum = 0;
            for (let j = 0; j < 3; j++) {
                if (tempBoard[i][j].getValue() === 0) {
                    rowSum += 10;
                } else {
                    rowSum += tempBoard[i][j].getValue();
                }
            }
            rowSums.push(rowSum);
        }

        let filteredRowSums = rowSums.filter((sum) => (sum === 3 || sum === 6));
        if (filteredRowSums.length > 0) {
            return true;
        }

        let colSums = [];

        for (let i = 0; i < 3; i++) {
            let colSum = 0;
            for (let j = 0; j < 3; j++) {
                if (tempBoard[j][i].getValue() === 0) {
                    colSum += 10;
                } else {
                    colSum += tempBoard[j][i].getValue();
                }
            }
            colSums.push(colSum);
        }

        let filteredColSums = colSums.filter((sum) => (sum === 3 || sum === 6));
        if (filteredColSums.length > 0) {
            return true;
        }

        let diagSum = 0;

        for (let i = 0; i < 3; i++) {
            if (tempBoard[i][i].getValue() === 0) {
                diagSum += 10;
            } else {
                diagSum += tempBoard[i][i].getValue();
            }
        }

        if (diagSum === 3 || diagSum === 6) {
            return true;
        }

        let antidiagSum = 0;

        for (let i = 0; i < 3; i++) {
            if (tempBoard[i][2-i].getValue() === 0) {
                antidiagSum += 10;
            } else {
                antidiagSum += tempBoard[i][2-i].getValue();
            }
        }

        if (antidiagSum === 3 || antidiagSum === 6) {
            return true;
        }

        return false;
    };

    const playRound = (row, column) => {
        while (true) {
            if (board.legalMove(row, column)) {
                break;
            } else {
                console.log(`Invalid move`);
                return;
            }
        }

        console.log(`Dropping ${getActivePlayer().name}'s token into 
        row ${row} and column ${column}`);
        board.makeMove(row, column, getActivePlayer().token);

        increaseTurns();
        if (getTurns() >= 5) {
            if (checkWin()) {
                printWinner(getActivePlayer().name);
            } else {
                if (turns === 9) {
                    printDraw();
                } else {
                    switchPlayerTurn();
                    printNewRound();
                }
            }
        } else {
            switchPlayerTurn();
            printNewRound();
        }
    };

    const printDraw = () => {
        console.log("It's a draw");
    };

    const printWinner = (name) => {
        console.log(`${name} is the winner!`);
    }

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    }
}

function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

        board.forEach((row, i) => {
            row.forEach((cell, j) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = i;
                cellButton.dataset.column = j;
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            });
        });
    };

    function clickHandlerBoard(e) {
        const rowIndex = e.target.dataset.row;
        if (!rowIndex) return;
        const colIndex = e.target.dataset.column;
        if (!colIndex) return;

        game.playRound(rowIndex, colIndex);
        updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen();
}

ScreenController();