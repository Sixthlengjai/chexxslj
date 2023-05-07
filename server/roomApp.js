const common = require('./common.js')
const room = require('./room.js')
const user = require('./user.js')
const error = require('./error.js')

module.exports = (app) => {
    app.post('/requestRoom', (req, res) => {
        // console.log('New request for rooms')
        // console.log(room.listAllRooms())
        res.send(room.listAllRooms())
    })

    app.post('/createRoom', (req, res) => {
        if (!req.session.user) {
            console.log('No user exists')
            return res.status(error.NoUserExists).json({})
        }
        var creator = req.session.user
        if (creator.room !== null) {
            console.log('Already in room')
            return res.status(error.AlreadyInRoom).json({})
        }
        var newRoom = room.createRoom(creator)
        return res.status(200).json({ roomID: newRoom.roomID })
        // res.redirect(`/joinRoom?roomID=${newRoom.roomID}`)
    })

    app.post('/joinRoom', (req, res) => {
        if (!req.session.user) {
            console.log('No user exists')
            return res.status(error.NoUserExists).json({})
        }
        if (!req.body) {
            console.log('No body error')
            return res.status(error.NoBodyError).json({})
        }
        if (!req.body.hasOwnProperty('roomID')) {
            console.log('No room exists')
            return res.status(error.NoRoomExists).json({})
        }

        // var jr = room.getRoom(req.query.roomID)
        var jr = room.getRoom(req.body.roomID)
        var pl = req.session.user

        console.log(`Join room request received with room ${req.body.roomID}`)
        console.log(jr)

        if (jr === null) {
            console.log(room.rooms)
            console.log('No room exists')
            return res.status(error.NoRoomExists).json({})
        }

        if (!jr.joinRoom(pl)) {
            console.log('Room size exceed')
            return res.status(error.RoomSizeExceeds).json({})
        }

        console.log('Join room success')
        return res.status(200).json({})
    })
}