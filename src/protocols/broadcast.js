const {GAMES, PLAYERS} = require("../state")


module.exports = function (gameId){
    const game = GAMES[gameId]
    const data = JSON.stringify({
        "protocol": "broadcast",
        "game": game
    })
    // console.log(data)
    for (let player in game.players){
        PLAYERS[player].send(data)
    }
}