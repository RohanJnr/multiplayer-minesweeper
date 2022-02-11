const Minesweeper = require("../game")
const broadcast = require("./broadcast")

const {GAMES, PLAYERS} = require("../state")


/*
Sample data:
{
    protocol: join,
    name: iceman,
    gameid: id
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
    game.joinGame(data.name)
    PLAYERS[data.name] = ws
    broadcast(game.id)
}
