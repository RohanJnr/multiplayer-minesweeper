const state = {
    boardGenerated: false,
    name: ""
}

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

const gameid = params.gameid

const ws = new WebSocket("ws://localhost:8080")
ws.addEventListener("open", () => {
    console.log("Connected")
})

const main = document.getElementById("main")


const newGameBtn = document.getElementById("newgame-btn")
const nameInput = document.getElementById("name-input")
const gameIdInput = document.getElementById("gameid-input")
const gameIdBtn = document.getElementById("gameid-btn")
const gameId = document.getElementById("game-id")

const board = document.getElementById("board")



newGameBtn.addEventListener("click", e => {
    state.name = nameInput.value
    ws.send(JSON.stringify({
        "protocol": "create",
        "name": state.name
    }))
})

gameIdBtn.addEventListener("click", e => {
    state.name = nameInput.value
    const gameid = gameIdInput.value
    const data = {
        "protocol": "join",
        "name": state.name,
        "gameid": gameid
    }
    console.log(data)
    ws.send(JSON.stringify(data))
})


const generateBoard = data => {
    board.innerHTML = ""
    gameId.innerText = data.id
    const boardData = data.board
    const rows = data.rows
    const columns = data.columns

    for (let y=0; y < rows; y++){
        const div = document.createElement("DIV")
        div.classList.add("row")
        for (let x=0; x < columns; x++){
            const cell = document.createElement("DIV")
            
            cell.addEventListener("click", e => {
                ws.send(JSON.stringify({
                    "protocol": "reveal",
                    "name": state.name,
                    "gameid": data.id,
                    "cellx": x,
                    "celly": y
                }))
            })

            cell.addEventListener("contextmenu", e => {
                e.preventDefault()
                // flag cell
                ws.send(JSON.stringify({
                    "protocol": "flag",
                    "name": state.name,
                    "gameid": data.id,
                    "cellx": x,
                    "celly": y
                }))
            })

            cell.classList.add("cell")

            const cellValue = document.createElement("SPAN")
            let value = boardData[x][y].value
            if (value === 0 || value === "M"){
                value=" "
            }

            let valueTextNode = document.createTextNode(value)


            if (!boardData[x][y].revealed && !boardData[x][y].isFlagged){cellValue.classList.add("hidden")}
            if (boardData[x][y].revealed){cell.classList.add("revealed")}

            if (boardData[x][y].isFlagged){valueTextNode=document.createTextNode("F")}

    
            


            cellValue.appendChild(valueTextNode)
            cellValue.classList.add("cell-value")


            cell.appendChild(cellValue)
            div.appendChild(cell)
        }

        board.appendChild(div)
    }
    boardGenerated=true

}

ws.addEventListener("message", data => {
    data = JSON.parse(data.data)
    if (data.protocol === "broadcast"){
        console.log(data.game)
        generateBoard(data.game)
    }
})

