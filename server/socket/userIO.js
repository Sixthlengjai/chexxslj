const user = require('../user.js')

module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('changeUserSocket', (username) => {
            var pl = user.findUserByName(username)
            if (pl === null) return
            user.users.get(pl.id).socketID = socket.id
            console.log(`${pl.username} has changed his socketid to ${socket.id}`)
        })

        socket.on('pingSocket', () => {
            socket.emit('resPingSocket')
        })
    })
}