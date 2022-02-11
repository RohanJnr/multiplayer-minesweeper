const Minesweeper = require("../game")
const broadcast = require("./broadcast")

const {GAMES, PLAYERS} = require("../state")


/*
Sample data:
{
    protocol: flag,
    name: iceman,
    gameid: id
    cellx: 0,
    celly: 0
}
*/

module.exports = function (ws, data) {
    const game = GAMES[data.gameid]

    if (game === undefined){
        ws.send(JSON.stringify({
            "protocol": "error",
            "message": "Game not found."
        }))
        return
    }
    game.toggleFlagCell(data.cellx, data.celly, data.name)
    broadcast(game.id)
}
