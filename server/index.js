const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const cors = require('cors')
app.use(cors())
app.use(express.json())

const config = require('./config.js')

const socketIO = require('socket.io')
const io = socketIO(server, {
    cors: {
        origin: config.clientLink
    }
})

const PORT = config.port

require('./userApp.js')(app)
require('./roomApp.js')(app)

if (config.test) {
    require('./testing/existUser')
}

io.on('connection', (socket) => {
    console.log(`New socket user connected at id ${socket.id}`)
    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} has disconnected`)
    })
})

require('./socket/roomIO.js')(io)
require('./socket/gameIO.js')(io)
require('./socket/userIO.js')(io)

server.listen(PORT, () => {
    console.log(`Server listening at PORT ${PORT}.`)
})