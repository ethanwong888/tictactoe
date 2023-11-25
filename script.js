// Player object
function Player(name, symbol) {
  this.name = name;
  this.symbol = symbol;
}

// GameBoard object
function GameBoard() {
  this.board = Array(9).fill(null);
}

GameBoard.prototype = {
  // creating the board and each individual square + adding event listener for when a square is clicked
  display: function () {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';

    this.board.forEach((cell, index) => {
      const cellElement = document.createElement('div');
      cellElement.classList.add('cell');
      cellElement.dataset.index = index;
      cellElement.textContent = cell;
      cellElement.addEventListener('click', () => gameController.makeMove(index));
      boardElement.appendChild(cellElement);
    });
  },

  isFull: function () {
    return this.board.every(cell => cell !== null);
  },

  isEmptyCell: function (index) {
    return this.board[index] === null;
  },

  checkWinner: function () {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    // loop through winning combinations to check if player has won
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        return pattern;
      }
    }

    return null;
  }
};


function openModal(message) {
  const modal = document.getElementById('modal');
  const modalMessage = document.getElementById('modal-message');
  modal.style.display = 'block';
  modalMessage.textContent = message;
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
}


// GameController object
function GameController(player1, player2) {
  this.players = [player1, player2];
  this.currentPlayerIndex = 0;
  this.gameBoard = new GameBoard();
}

GameController.prototype = {
  start: function () {
    this.gameBoard.display();
  },

  makeMove: function (index) {
    if (this.gameBoard.isEmptyCell(index)) {
      this.gameBoard.board[index] = this.players[this.currentPlayerIndex].symbol;
  
      const winnerPattern = this.gameBoard.checkWinner();
      this.gameBoard.display();
  
      if (winnerPattern) {
        openModal(`${this.players[this.currentPlayerIndex].name} wins!`);
        // Reset game when modal is closed
        const modal = document.getElementById('modal');
        modal.onclick = function () {
          gameController.resetGame();
          closeModal();
        };
      }
      else if (this.gameBoard.isFull()) {
        openModal('It\'s a draw!');
        // Reset game when modal is closed
        const modal = document.getElementById('modal');
        modal.onclick = function () {
          gameController.resetGame();
          closeModal();
        };
      }
      else {
        this.currentPlayerIndex = 1 - this.currentPlayerIndex;
      }
    }
  },

  resetGame: function () {
    this.gameBoard = new GameBoard();
    this.currentPlayerIndex = 0;
    this.gameBoard.display();
  }
};



// Create players
const player1 = new Player('Player 1', 'X');
const player2 = new Player('Player 2', 'O');

// Create game controller
const gameController = new GameController(player1, player2);

// Start the game
gameController.start();
