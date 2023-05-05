const common = require('./common.js')
const game = require('./game.js')
const user = require('./user.js')

const rooms = new Map()

const WHITE = 0
const BLACK = 1

class Room {
    constructor(roomID, creator, joinFirst = false) {
        this.roomID = roomID // String
        this.joinedUsers = [] // Array<User>
        this.status = 'INIT' // String
        this.seats = 2 // Int
        this.host = null // User
        this.game = null // Game
        this.creator = creator

        if (joinFirst) {
            this.joinRoom(creator)
            if (this.getNumOfUsers() > 0) {
                this.host = creator
            } 
        }
    }

    joinAvailable() {
        if (!(this.status === 'WAITING' || this.status === 'INIT')) return false
        if (this.getNumOfUsers() >= this.seats) return false
        return true
    }

    joinRoom(us) {
        if (this.joinAvailable()) {
            if (this.joinedUsers.some(usr => usr.id === us.id)) {
                return false
            }
            if (this.joinedUsers.length === 0) {
                this.host = us
            }
            this.joinedUsers.push(us)
            this.status = 'WAITING'
            user.getUser(us.id).room = this.roomID
            if (this.getNumOfUsers() >= this.seats) {
                this.assignColors()
            }
            return true
        }
        return false
    }

    leaveRoom(us) {
        this.joinedUsers.slice(this.joinedUsers.indexOf(us), 1)
        if (this.host === us) {
            this.changeHost()
        }
    }

    assignColors() {
        this.assignColors = common.shuffle(this.assignColors)
    }

    changeHost(newHost = null) {
        if (newHost === this.host) {
            return false
        }
        let originHost = this.host
        do {
            if (newHost === null) {
                this.host = this.joinedUsers[common.randomInt(this.getNumOfUsers())]
            } else {
                this.host = newHost
            }
        } while (this.host !== originHost)
    }

    getNumOfUsers() {
        return this.joinedUsers.length
    }

    startGame() {
        this.game = new game.Game()
        this.status = 'GAMING'
    }
}

const createRoom = (createUser) => {
    var newRoomID
    do {
        newRoomID = common.generateUID(10, true, true, true)
    } while (newRoomID in rooms)
    var newRoom = new Room(newRoomID, createUser)
    rooms.set(newRoomID, newRoom)
    console.log(`New room created with id ${newRoomID} and creator ${createUser.username}`)
    return newRoom
}

const listAllRooms = () => {
    var roomList = []
    for (var [roomID, room] of rooms) {
        roomList.push(room)
    }
    return roomList
}

const getRoom = (roomID) => {
    if (rooms.has(roomID)) {
        return rooms.get(roomID)
    }
    return null
}

module.exports = {
    Room,
    rooms,
    createRoom,
    listAllRooms,
    getRoom
}