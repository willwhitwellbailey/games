'use strict';
const readline = require('readline');

// values will be modulo 10 - unclicked is less than 10, clicked is greater than
let testBoard = [ // using 9s to make a mine since a square can only be surrounded by 8
  [ 0, 0, 0, 0, 9 ],
  [ 0, 0, 0, 0, 9 ],
  [ 0, 0, 9, 0, 0 ],
  [ 9, 0, 0, 0, 9 ],
  [ 0, 0, 9, 0, 0 ]
];

const charUtil = {
  unclicked: String.fromCharCode(2011),
  zeroSquare: '-',
  flag: 'f',
  mine: String.fromCharCode(248)
}

class Minesweeper {
  constructor() {
    let [ rows, cols, mines ] = [ ...arguments ];
    let mineBoard = this._createMineBoard(rows, cols, mines) || testBoard;
    this.board = this._addValues(mineBoard);
    this.status = true;
  }

  _createMineBoard(rows, cols, mines) {

    // TODO: create map of 0s and 9s
    // map is passed in as row, col
    // row and col empty - 10x10
    // row xor col empty - row === col (square board)
    // mines is an integer
    // 0 < mines < row * col - 1
    // mines empty - mines = Math.floor(row * col / 10)
    const defaultSize = 10;

    let board = (new Array(rows || cols || defaultSize)).fill((new Array(cols || rows || defaultSize)).fill(0));
    let mineCount = mines || Math.floor(board.length * board[0].length / 10);
    console.log('HERE');

    let mineSet = new Set();
    while (mineSet.size < mineCount) {
      const row = Math.ceil(Math.random() * board.length) - 1;
      const col = Math.ceil(Math.random() * board[0].length) - 1;
      mineSet.add([row, col]);
    }

    let mineArray = Array.from(mineSet);
    for (let i = 0; i < mineArray.length; i++) {
      board[mineArray[i][0]][mineArray[i][1]] = 9;
    }
    console.log('HERE2');

    return board;
  }

  _addValues(board) {
    return board.map((row, rowIndex) => {
      return row.map((col, colIndex) => {
        if (col === 9) {
          return 9;
        }

        let count = 0;
        if (rowIndex - 1 >= 0 && colIndex - 1 >= 0 && board[rowIndex - 1][colIndex - 1] === 9) { // NW
          count++;
        }
        if (rowIndex - 1 >= 0 && board[rowIndex - 1][colIndex] === 9) { // N
          count++;
        }
        if (rowIndex - 1 >= 0 && colIndex + 1 < board[0].length && board[rowIndex - 1][colIndex + 1] === 9) { // NE
          count++;
        }
        if (colIndex - 1 >= 0 && board[rowIndex][colIndex - 1] === 9) { // W
          count++;
        }
        if (colIndex + 1 < board[0].length && board[rowIndex][colIndex + 1] === 9) { // E
          count++;
        }
        if (rowIndex + 1 < board.length && colIndex - 1 >= 0 && board[rowIndex + 1][colIndex - 1] === 9) { // SW
          count++;
        }
        if (rowIndex + 1 < board.length && board[rowIndex + 1][colIndex] === 9) { // S
          count++;
        }
        if (rowIndex + 1 < board.length && colIndex + 1 < board[0].length && board[rowIndex + 1][colIndex + 1] === 9) { // SE
          count++;
        }

        return count;
      });
    })
  }

  getStatus() {
    // TODO:
    // win! (only mines remain unclicked)
    // lose! (mine was clicked (through select method))
    // cautious... (flags have been placed on too many tiles)
    return this.status;
  }

  // _checkAround(row, col, checkFn, actionFn) {
  //   if (row - 1 >= 0 && col - 1 >= 0) {
  //     if (checkFn(row - 1, col - 1)) {
  //       actionFn(row - 1, col - 1);
  //     }
  //   }
  // }

  _handleZeroSelect(row, col) {
    let queue = [];
    let visited = new Set();
    queue.push([row, col]);

    while (queue.length) {
      let [r, c] = queue.shift();
      this.board[r][c] += 10;
      visited.add([r, c]);
      // check surrounding tiles
      // if 0 and not visited, add to queue
      // else "select" to show number
      if (r - 1 >= 0 && c - 1 >= 0) { // NW
        if (this.board[r - 1][c - 1] === 0 && !visited.has([r - 1, c - 1])) {
          queue.push([r - 1, c - 1]);
        } else {
          this.select(r - 1, c - 1);
        }
      } 
      if (r - 1 >= 0) { // N
        if (this.board[r - 1][c] === 0 && !visited.has([r - 1, c])) {
          queue.push([r - 1, c]);
        } else {
          this.select(r - 1, c);
        }
      }
      if (r - 1 >= 0 && c + 1 < this.board[0].length) { // NE
        if (this.board[r - 1][c + 1] === 0 && !visited.has([r - 1, c + 1])) {
          queue.push([r - 1, c + 1]);
        } else {
          this.select(r - 1, c + 1);
        }
      }
      if (c - 1 >= 0) { // W
        if (this.board[r][c - 1] === 0 && !visited.has([r, c - 1])) {
          queue.push([r, c - 1]);
        } else {
          this.select(r, c - 1);
        }
      }
      if (c + 1 < this.board[0].length) { // E
        if (this.board[r][c + 1] === 0 && !visited.has([r, c + 1])) {
          queue.push([r, c + 1]);
        } else {
          this.select(r, c + 1);
        }
      }
      if (r + 1 < this.board.length && c - 1 >= 0) { // SW
        if (this.board[r + 1][c - 1] === 0 && !visited.has([r + 1, c - 1])) {
          queue.push([r + 1, c - 1]);
        } else {
          this.select(r + 1, c - 1);
        }
      }
      if (r + 1 < this.board.length) { // S
        if (this.board[r + 1][c] === 0 && !visited.has([r + 1, c])) {
          queue.push([r + 1, c]);
        } else {
          this.select(r + 1, c);
        }
      }
      if (r + 1 < this.board.length && c + 1 < this.board[0].length) { // SE
        if (this.board[r + 1][c + 1] === 0 && !visited.has([r + 1, c + 1])) {
          queue.push([r + 1, c + 1]);
        } else {
          this.select(r + 1, c + 1);
        }
      }
    }
  }

  select(row, col) {
    // if (this.board[row - 1][col - 1] === 0) {
    //   console.log('TODO - handle zeroes');
    //   this._handleZeroSelect(row - 1, col - 1);
    // }
    this.board[row - 1][col - 1] += 10;
    if (this.board[row - 1][col - 1] % 10 === 9) {
      this.status = false;
    }
  }

  flag (row, col) {
    this.board[row - 1][col - 1] = charUtil.flag;
  }

  print() {
    let board = this.board;
    let printer = board.map((row, i) => {
      let rowString = `${i + 1}: `;
      row.map(tile => {
        let val = '';
        if (tile < 10) {
          val = charUtil.unclicked;
        } else if (tile === 10) {
          val = charUtil.zeroSquare;
        } else if (tile % 10 !== 9) {
          val = tile % 10;
        } else {
          val = charUtil.mine;
        }
        rowString = `${rowString}${val} `;
      });
      return rowString;
    });

    printer.unshift(`   ${[...Array(board[0].length).keys()].map(i => i + 1).join(' ')}`);
    console.log(printer.join('\n'));
  }

  testPrint() {
    let board = this.board;
    let printer = board.map(row => {
      let rowString = '';
      row.map(tile => {
        let val = '';
        if (tile % 10 !== 9) {
          val = tile % 10;
        } else {
          val = charUtil.mine;
        }
        rowString = `${rowString}${val}`;
      });
      return rowString;
    });

    console.log(printer.join('\n'));
  }
}

let game = new Minesweeper();
game.print();
game.testPrint();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.prompt();

let choices = [];
rl.on('line', line => {
  if (choices[choices.length - 1] && choices[choices.length - 1].length === 1) {
    choices[choices.length - 1].push(line.trim());
    game.select(...choices[choices.length - 1]);
    game.print();
  } else {
    choices.push([ line.trim() ]);
  }

  if (!game.getStatus()) {
    rl.close();
  }

}).on('close', () => {
  console.log('thanks for playing!');
  process.exit(0);
});



// play game??
//   no - quit
//   yes
// default or other??
//   other
//     set row, col, mines
// play until status is false
// cycle back up




