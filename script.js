const msg = document.getElementById('gameMsg');
msg.innerHTML = "GOOD LUCK!";
let gameStatus = true;
let rows = 9;
let cols = 9;
let minesNumber = 8;
let matrix = [[ "", "", "", "", "", "", "", "", "", "", ""],
              [ "", "", "", "", "", "", "", "", "", "", ""],
              [ "", "", "", "", "", "", "", "", "", "", ""],
              [ "", "", "", "", "", "", "", "", "", "", ""],
              [ "", "", "", "", "", "", "", "", "", "", ""],
              [ "", "", "", "", "", "", "", "", "", "", ""],
              [ "", "", "", "", "", "", "", "", "", "", ""],
              [ "", "", "", "", "", "", "", "", "", "", ""],
              [ "", "", "", "", "", "", "", "", "", "", ""],
              [ "", "", "", "", "", "", "", "", "", "", ""],
              [ "", "", "", "", "", "", "", "", "", "", ""]];

function getRandomPos(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomMines() {
  for (let i = 0; i < minesNumber;) {
    let positionX = getRandomPos(1, rows);
    let positionY = getRandomPos(1, rows);
    if (matrix[positionX][positionY] !== "💣") {
      matrix[positionX][positionY] = "💣";
      ++i;
    }
  }
}

function setZeros() {
   for (let x = 0; x < rows + 2; ++x) {
    for (let y = 0; y < cols + 2; ++y) {
      if (matrix[x][y] !== "💣") {
        matrix[x][y] = 0;
      }
    }
  }
}

function setMinesNumber() {
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

randomMines();
setZeros();
setMinesNumber();

function clickableGrid(){
  randomMines();
  setZeros();
  setMinesNumber();
  let discoverableCells = rows * cols - minesNumber;
  let grid = document.getElementById('gameBoard');
  for (let r = 1; r <= rows; ++r){
    let tr = grid.appendChild(document.createElement('tr'));
    for (let c = 1; c <= cols; ++c){
      let cell = tr.appendChild(document.createElement('td'));
      cell.id = r * 10 + c;
      let cellsId =  document.getElementById(cell.id);
      //function for left-click
      cell.addEventListener('click', function() {
        if (gameStatus) {
          if (matrix[cell.id[0]][cell.id[1]] === "💣" && cellsId.innerHTML !== "🚩") {
            for (let x = 1; x <= rows; ++x) {
              for (let y = 1; y <= cols; ++y) {
                if (matrix[x][y] === "💣") {
                  document.getElementById(x * 10 + y).innerHTML = "💣";
                  document.getElementById(x * 10 + y).style.backgroundColor = "crimson";
                  msg.innerHTML = "GAME OVER!";
                  msg.style.backgroundColor = "crimson";
                  gameStatus = false;
                }
              }
            }
          }
          else if (cellsId.innerHTML !== "🚩") {
            if (cellsId.style.backgroundColor !== "white") {
              --discoverableCells;
            }           
            cellsId.innerHTML = matrix[cell.id[0]][cell.id[1]];
            cellsId.style.backgroundColor = "white";
            if (discoverableCells === 0) {
              msg.innerHTML = "YOU WON!";
              msg.style.backgroundColor = "lawngreen";
              gameStatus = false;
            }
          }
        }    
      });
      //function for right-click
      cell.addEventListener('contextmenu', function (e) {
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

clickableGrid();
