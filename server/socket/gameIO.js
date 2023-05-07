module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('pingGame', ({ username, roomID }, callback) => {
            var rm = room.getRoom(roomID)
            var pl = user.findUserByName(username)
            if (pl === null) return
            if (rm.joinedPlayers.indexOf(pl) === -1) return
            pl.status = 'GAMING'
            callback({ status: 'success' })

            for (var player of rm.joinedPlayers) {
                if (player.status !== 'GAMING') return
            }
            rm.startGame()
            io.to(roomID).emit('sendChessBoard', rm.game.socketChessBoard())
        })
    })
}