const game = (() => {
  "use strict";

  const o = document.querySelector("#o");
  const x = document.querySelector("#x");
  const grid = document.querySelector("#grid");
  const selectionDiv = document.querySelector("#selection");
  const error = document.querySelector("#error");
  const p1 = document.querySelector("#p1");
  const p2 = document.querySelector("#p2");
  const winner = document.querySelector("#winner");
  const reset = document.querySelector("#reset");
  const roundCount = document.querySelector("#round-count");

  let winInd = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let board = ["e", "e", "e", "e", "e", "e", "e", "e", "e"];
  let rounds = 1;
  let p1Score = 0;
  let p2Score = 0;

  x.addEventListener("click", (event) => {
    signSelection()("x");
    selectionDiv.style.display = "none";
    grid.style.display = "grid";
    updateRound();
    updateScore();
  });
  o.addEventListener("click", (event) => {
    signSelection()("o");
    selectionDiv.style.display = "none";
    grid.style.display = "grid";
    updateRound();
    updateScore();
  });

  reset.addEventListener("click", (event) => {
    if (reset.textContent === "NEW GAME") {
      restartGame();
    } else if (winner.textContent !== "It's a tie!") {
      rounds++;
      updateRound();
    }
    winner.textContent = "";
    reset.style.display = "none";
    board = ["e", "e", "e", "e", "e", "e", "e", "e", "e"];
    startGame();
  });

  let p1Selected = null;
  let p2Selected = null;
  let turnSign = null;

  const setSelected = (sign) => {
    p1Selected = sign;
    turnSign = p1Selected;
    if (sign === "x") {
      p2Selected = "o";
    } else {
      p2Selected = "x";
    }
  };

  const signSelection = () => {
    return setSelected;
  };

  const displayBoard = () => {
    grid.innerHTML = "";
    for (let i = 0; i < board.length; i++) {
      const gridDiv = document.createElement("div");
      gridDiv.classList.add("grid-item");
      grid.appendChild(gridDiv);
    }
  };

  const putSign = () => {
    const gridDivs = document.querySelectorAll(".grid-item");
    gridDivs.forEach((div, i) => {
      div.addEventListener("click", (event) => {
        if (event.target.innerHTML === "") {
          event.target.innerHTML = turnSign;
          error.textContent = "";
          board.splice(i, 1, turnSign);
          checkBoard(board, turnSign);
          switchSigns();
        } else if (!board.includes("e")) {
          disableGrid();
        } else {
          error.style.display = "block";
          error.textContent = "PLEASE CHOOSE AN EMPTY BOX";
        }
      });
    });
  };

  const switchSigns = () => {
    if (turnSign === p1Selected) {
      turnSign = p2Selected;
    } else if (turnSign === p2Selected) {
      turnSign = p1Selected;
    }
  };

  const checkBoard = (b, sign) => {
    let check = 0;
    start: for (let i = 0; i < winInd.length; i++) {
      for (let j = 0; j < winInd[i].length; j++) {
        if (b[winInd[i][j]] === sign) {
          check++;
          if (check === 3) {
            console.log(`player with ${sign} won!`);
            disableGrid();
            win();
            updateScore();
            endGame();
            return;
          }
        } else {
          check = 0;
          continue start;
        }
      }
    }
    tie();
    return;
  };

  const disableGrid = () => {
    const gridDivs = document.querySelectorAll(".grid-item");
    for (let i = 0; i < gridDivs.length; i++) {
      gridDivs[i].classList.add("disable");
    }
  };

  const win = () => {
    if (turnSign === p1Selected) {
      winner.textContent = "Player 1 Won!";
      p1Score++;
      reset.style.display = "block";
      reset.textContent = "RESET";
    } else {
      winner.textContent = "Player 2 Won!";
      p2Score++;
      reset.style.display = "block";
      reset.textContent = "RESET";
    }
  };

  const tie = () => {
    if (!board.includes("e")) {
      disableGrid();
      winner.textContent = "It's a tie!";
      reset.style.display = "block";
      reset.textContent = "RESET";
    }
  };

  const updateRound = () => {
    roundCount.style.display = "block";
    roundCount.textContent = `Round: ${rounds}`;
  };

  const updateScore = () => {
    p1.textContent = `Player 1: ${p1Score}`;
    p2.textContent = `Player 2: ${p2Score}`;
  };

  const endGame = () => {
    if (p1Score === 5 || p2Score === 5) {
      disableGrid();
      reset.textContent = "NEW GAME";
      if (p1Score === 5) {
        roundCount.textContent = `PLAYER 1 WON!`;
      } else if (p2Score === 5) {
        roundCount.textContent = `PLAYER 2 WON!`;
      }
    }
  };

  const startGame = () => {
    displayBoard();
    putSign();
  };

  const restartGame = () => {
    selectionDiv.style.display = "flex";
    grid.style.display = "none";
    p1Score = 0;
    p2Score = 0;
    rounds = 1;
    p1Selected = null;
    p2Selected = null;
    turnSign = null;
    roundCount.style.display = "none";
    roundCount.textContent = "";
    p1.textContent = "";
    p2.textContent = "";
  };

  return {
    startGame,
  };
})();

game.startGame();
