const AROUND_CELL_OPERATORS = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
];


class Player {
    constructor(name, websocket){
        this.name = name
        this.websocket = websocket
    }
}

class Cell {
    constructor(x, y, value) {
        this.value = value
        this.isFlagged = false
        this.player = null
        this.x = x
        this.y = y
        this.revealed = false
    }
}


class Minesweeper {
    constructor(rows, columns, numMines, owner) {
        this.rows = rows;
        this.columns = columns;
        this.numMines = numMines;
        this.board = [];
        this.minesPositions = [];
        this.nonmines = this.rows*this.columns - this.numMines
        

        this.players = {}  // player name: score
        this.players[owner] = 0
        this.id = this.generateId()
        this.owner = owner

        this.generateEmptyBoard();
        this.generateMinesPositions();
        this.insertMines();
        this.updateBoardNumbers();

    }

    generateId(){
        // Return 3 letter code
        return Math.random().toString(36).substring(2, 5);
    }

    joinGame(player){
        this.players[player] = 0
    }

    toggleFlagCell(x, y, player){
        this.board[x][y].isFlagged = !this.board[x][y].isFlagged
        this.board[x][y].player = player
    }

    generateEmptyBoard() {
        for (let y = 0; y < this.rows; y++) {
            this.board.push([]);
            for (let x = 0; x < this.columns; x++) {
                this.board[y][x] = new Cell(x, y, 0);
            }
        }
    }

    generateMinesPositions() {
        this.minesPositions = [];
        
        while (this.minesPositions.length < this.numMines) {
            const y = this.getRandomInt(0, this.rows);
            const x = this.getRandomInt(0, this.columns);

            if (!this.isAlreadyAMine([y, x])) {
                this.minesPositions.push([y, x]);
            }
        }
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    isAlreadyAMine(minePosition) {
        return this.minesPositions.join(" ").includes(minePosition.toString());
    }

    insertMines() {
        for (let i = 0; i < this.minesPositions.length; i++) {
            const y = this.minesPositions[i][0];
            const x = this.minesPositions[i][1];
            this.board[y][x].value = "M";
        }
    }

    updateBoardNumbers() {
        for (let i = 0; i < this.minesPositions.length; i++) {
            for (let j = 0; j < AROUND_CELL_OPERATORS.length; j++) {
                const minePosition = this.minesPositions[i];
                const around = AROUND_CELL_OPERATORS[j];
                const boardY = minePosition[0] + around[0];
                const boardX = minePosition[1] + around[1];

                if (boardY >= 0 && boardY < this.rows &&
                    boardX >= 0 && boardX < this.columns &&
                    typeof this.board[boardY][boardX].value === 'number') {
                    this.board[boardY][boardX].value+=1;
                }
            }
        }
    }

    cellsRevealed(x,y) {
        let show=[];
        show.push(this.board[x][y])
        while(this.board.length!=0)
        {
            let one=show.pop()
            if(!one)
            break;
            let i=one.x;
            // console.log(one.x);
            let j=one.y;
            // console.log(one.y);
            if(one.revealed===false)
            {
                this.nonmines--;
                one.revealed=true;
            }
            if(one.value!=0)
            {
                break;
            }
            //top left
            if(i>0 && j>0 && this.board[i-1][j-1].value===0 && !this.board[i-1][j-1].revealed){
                show.push(this.board[i-1][j-1])
            }
            //bottom right
            if(i<this.board.length-1 && j<this.board[0].length-1 && this.board[i+1][j+1].value===0 && !this.board[i+1][j+1].revealed ){
                show.push(this.board[i+1][j+1])
            }
            //top right
            if(
                i>0 && j<this.board[0].length-1 && this.board[i-1][j+1].value===0 &&  !this.board[i-1][j+1].revealed){
                show.push(this.board[i-1][j+1]);
            }
            //bottom left
            if(
                i<this.board.length-1 && j>0 && this.board[i+1][j-1].value===0 && !this.board[i+1][j-1].revealed){
                show.push(this.board[i+1][j-1]);
            }
            //top
            if(i>0 && this.board[i-1][j].value===0 && !this.board[i-1][j].revealed){
                show.push(this.board[i-1][j]);
            }
            //right
            if( j<this.board[0].length-1 && this.board[i][j+1].value===0 && !this.board[i][j+1].revealed){
                show.push(this.board[i][j+1]);
            }
            if( j>0 && this.board[i][j-1].value===0 && !this.board[i][j-1].revealed){
                show.push(this.board[i][j-1]);
            }
    
    
            // start revealing the cells
    
            if (i > 0 && j > 0 && !this.board[i - 1][j - 1].revealed) {
                //Top Left Reveal
                this.board[i - 1][j - 1].revealed = true;
                this.nonmines--;
            }
            if (j > 0 && !this.board[i][j - 1].revealed) {
            // Left Reveal
            this.board[i][j - 1].revealed = true;
            this.nonmines--;
            }
            if ( i < this.board.length - 1 && j > 0 && !this.board[i + 1][j - 1].revealed ) {
            //Bottom Left Reveal
            this.board[i + 1][j - 1].revealed = true;
            this.nonmines--;
            }
            if (i > 0 && !this.board[i - 1][j].revealed) {
            //Top Reveal
            this.board[i - 1][j].revealed = true;
            this.nonmines--;
            }
            if (i < this.board.length - 1 && !this.board[i + 1][j].revealed) {
            // Bottom Reveal
            this.board[i + 1][j].revealed = true;
            this.nonmines--;
            }
        
            if ( i > 0 && j < this.board[0].length - 1 && !this.board[i - 1][j + 1].revealed ) {
            // Top Right Reveal
            this.board[i - 1][j + 1].revealed = true;
            this.nonmines--;
            }
        
            if (j < this.board[0].length - 1 && !this.board[i][j + 1].revealed) {
            //Right Reveal
            this.board[i][j + 1].revealed = true;
            this.nonmines--;
            }
        
            if ( i < this.board.length - 1 && j < this.board[0].length - 1 && !this.board[i + 1][j + 1].revealed ) {
            // Bottom Right Reveal
            this.board[i + 1][j + 1].revealed = true;
            this.nonmines--;
            }
        
        }
    }



}

module.exports = Minesweeper
