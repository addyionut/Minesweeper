const msg = document.getElementById('gameMsg');
msg.innerHTML = "GOOD LUCK!";
msg.style.display = "none";
let rows, cols, currentRow, currentCol;
let discoverableCells;
let difficulty = document.getElementById('minesNo');
let text = document.getElementById('text');
let min = document.getElementById('min');
let med = document.getElementById('med');
let max = document.getElementById('max');
difficulty.style.display = "none";
let gameStatus = true;
let matrix = [];
for(let i = 0; i < 17; i++) {
  matrix[i] = [];
  for(let j = 0; j < 25; j++) {
    matrix[i][j] = 0;
  }
}

function getRandomPos(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomMines(minesNumber) {
  for (let i = 0; i < minesNumber;) {
    let positionX = getRandomPos(1, rows);
    let positionY = getRandomPos(1, cols);
    if (matrix[positionX][positionY] !== "💣") {
      matrix[positionX][positionY] = "💣";
      ++i;
    }
  }
}

function setMinesNumber(rows, cols) {
  for (let x = 1; x <= rows; ++x) {
    for (let y = 1; y <= cols; ++y) {
      if (matrix[x][y] === "💣") {
        if (matrix[x - 1][y - 1] !== "💣") {
          matrix[x - 1][y - 1] += 1;
        }
        if (matrix[x][y - 1] !== "💣") {
          matrix[x][y - 1] += 1;
        }
        if (matrix[x + 1][y - 1] !== "💣") {
          matrix[x + 1][y - 1] += 1;
        }
        if (matrix[x + 1][y] !== "💣") {
          matrix[x + 1][y] += 1;
        }
        if (matrix[x + 1][y + 1] !== "💣") {
          matrix[x + 1][y + 1] += 1;
        }
        if (matrix[x][y + 1] !== "💣") {
          matrix[x][y + 1] += 1;
        }
        if (matrix[x - 1][y + 1] !== "💣") {
          matrix[x - 1][y + 1] += 1;
        }
        if (matrix[x - 1][y] !== "💣") {
          matrix[x - 1][y] += 1;
        }
      }
    }   
  }
}

function showCell(x, y) {
  if (matrix[x][y] === 0) {
    document.getElementById(x + '-' + y).innerHTML = '';
  }
  else {
    document.getElementById(x + '-' + y).innerHTML = matrix[x][y];
  }
  document.getElementById(x + '-' + y).style.backgroundColor = "white";
  document.getElementById(x + '-' + y).style.fontWeight = "bold";
}

function unveilEmptyCells(row, col) {
  for (let m = row - 1; m <= row + 1; ++m) {
    for (let n = col - 1; n <= col + 1; ++n) { 
      if (m > 0 &&  m <= rows && n > 0 && n <= cols && document.getElementById(m + '-' + n).style.backgroundColor !== "white") {
        showCell(m,n);
        --discoverableCells;
        if (matrix[m][n] === 0) {
          unveilEmptyCells(m, n);
        }
        if (discoverableCells === 0) {
          gameWon();
        }
      }
    }
  }
}

function clickableGrid(minesNumber){
  randomMines(minesNumber);
  setMinesNumber(rows, cols);
  msg.style.display = "block";
  discoverableCells = rows * cols - minesNumber;
  let grid = document.getElementById('gameBoard');
  for (let r = 1; r <= rows; ++r){
    let tr = grid.appendChild(document.createElement('tr'));
    for (let c = 1; c <= cols; ++c){
      let cell = tr.appendChild(document.createElement('td'));
      cell.id = r + '-' + c;    
      let cellsId = document.getElementById(cell.id);
      let ids = cell.id.split('-');
      //function for left-click
      cell.addEventListener('click', function() {
        if (gameStatus && cellsId.innerHTML !== "🚩") {
          if (matrix[ids[0]][ids[1]] === "💣") {           
            for (let x = 1; x <= rows; ++x) {
              for (let y = 1; y <= cols; ++y) {
                if (matrix[x][y] === "💣") {
                  gameOver(x, y);
                }
              }
            }
          }
          else if (cellsId.style.backgroundColor !== "white") {  
            if (matrix[r][c] !== 0) {
              showCell(r, c);
              --discoverableCells;
            } 
            else if (matrix[r][c] === 0) {
              showCell(r, c);
              --discoverableCells;
              unveilEmptyCells(r, c);
            }
          } 
        } 
        if (discoverableCells === 0) {
          gameWon();
        }
      });
      //function for right-click
      cell.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        if (gameStatus) {
          if (cellsId.style.backgroundColor !== "white" && cellsId.innerHTML !== "🚩") {
            cellsId.innerHTML = "🚩";
          } 
          else if (cellsId.innerHTML === "🚩") {
            cellsId.innerHTML = "";
          }
        } 
      });
    }
  }
}

function setMinesNo(id) {
  if (id === levelBeginner) {
    rows = 9;
    cols = 9;
  }
  else if (id === levelIntermediate) {
    rows = 13;
    cols = 13;
  }
  else {
    rows = 15;
    cols = 23;
  }
  setLevels(cols);
}

function setLevels(cols) { 
  difficulty.style.display = "inline";
  if (cols === 9) {
    min.innerHTML = 10;
    med.innerHTML = 15;
    max.innerHTML = 20;
  }
  else if (cols === 13) {
    min.innerHTML = 20;
    med.innerHTML = 30;
    max.innerHTML = 40;
  }
  else {
    min.innerHTML = 50;
    med.innerHTML = 65;
    max.innerHTML = 80;
  }
}

function setTableBoard(id) {
  let minesNumber = document.getElementById(id).innerHTML;
  clickableGrid(minesNumber);
  disableButtons();
}

function disableButtons() {
  document.getElementById('minesNo').style.display = "none";
  document.getElementById('levelButtons').style.display = "none";
}

function gameWon() {
  msg.innerHTML = "YOU WON!";
  msg.style.backgroundColor = "lawngreen";
  gameStatus = false;
}

function gameOver(x, y) {
  document.getElementById(x + '-' + y).innerHTML = "💣";
  document.getElementById(x + '-' + y).style.backgroundColor = "crimson";
  msg.innerHTML = "GAME OVER!";
  msg.style.backgroundColor = "crimson";
  gameStatus = false;
}

function restartGame() {
  window.location.reload() 
}
