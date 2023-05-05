const users = new Map()

class User {
    constructor(id, username) {
        this.id = id // String
        this.username = username // String
        this.socketID = null // Socket
        this.room = null // String (roomID)
        this.status = 'HOME' // String
    }

    print() {
        console.log(`User(id: ${this.id}, username: ${this.username}, socketID: ${this.socketID}, status: ${this.status})`)
    }
}

const getUser = (userID) => {
    if (users.has(userID)) {
        return users.get(userID)
    }
    return null
}

const findUserByName = (username) => {
    for (var [userID, user] of users) {
        if (username === user.username) {
            return user
        }
    }
    return null
}

const createUser = (username) => {
    for (var [userID, user] of users) {
        if (user.username === username) {
            return null
        }
    }
    var newUser = new User(users.size, username)
    users.set(users.size, newUser)
    return newUser
}

module.exports = {
    User,
    users,
    getUser,
    findUserByName,
    createUser
}