const Minesweeper = require("../game")
const broadcast = require("./broadcast")

const {GAMES, PLAYERS} = require("../state")


/*
Sample data:
{
    protocol: create,
    name: iceman
}
*/

module.exports = function (ws, data) {
    PLAYERS[data.name] = ws
    const game = new Minesweeper(10, 10, 5, data.name);

    GAMES[game.id] = game

    broadcast(game.id)
}
