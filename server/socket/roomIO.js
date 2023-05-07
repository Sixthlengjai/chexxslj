const room = require('../room.js')
const game = require('../game.js')
const user = require('../user.js')

module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('joinRoom', (roomID, username) => {
            console.log(`[Socket]: Join Room request for room ${roomID} by ${username}`)
            var rm = room.getRoom(roomID)
            var pl = user.findUserByName(username)
            if (pl === null) {
                console.log('No player found')
                console.log('[Socket]: Join Room failed')
                return socket.emit('resJoinRoom', false, roomID)
            }
            if (rm === null) {
                console.log('[Socket]: Join Room failed')
                return socket.emit('resJoinRoom', false, roomID)
            }
            pl.room = roomID
            socket.join(roomID)
            console.log(`[Socket]: Join Room success`)
            socket.emit('resJoinRoom', true, roomID)
        })

        socket.on('pingGame', (roomID, username) => {
            var rm = room.getRoom(roomID)
            var pl = user.findUserByName(username)
            if (pl === null) return
            if (rm.joinedPlayers.indexOf(pl) === -1) return
            pl.status = 'GAMING'
            socket.emit('resPingGame', (rm.joinedPlayers.indexOf(pl)))

            for (var player of rm.joinedPlayers) {
                if (player.status !== 'GAMING') return
            }
            rm.startGame()
            io.to(roomID).emit('deliverChessBoard', rm.game.socketChessBoard())
        })
    })
}