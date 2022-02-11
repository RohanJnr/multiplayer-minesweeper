const ws = require("ws")
const createGame = require("./protocols/createGame")
const joinGame = require("./protocols/joinGame")
const flagCell = require("./protocols/flagCell")
const revealCell = require("./protocols/revealCell")

const wss = new ws.WebSocketServer({ port: 8080 })

protocolMapping = {
  "create": createGame,
  "join": joinGame,
  "flag": flagCell,
  "reveal": revealCell
}


wss.on('connection', ws => {
  console.log("connected websocket !")

  ws.on('message', message => {
    let data = JSON.parse(message)
    protocolMapping[data.protocol](ws, data)
  })


});

wss.on("close", ws => {
  console.log(`Conneciton closed: ${ws}`)
})
