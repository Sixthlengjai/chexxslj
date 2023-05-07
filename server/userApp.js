const multiparty = require('multiparty')
const session = require('express-session')

const user = require('./user.js')
const error = require('./error.js')

module.exports = (app) => {
    app.use(session({
        secret: 'chexxisgood',
        resave: false,
        saveUninitialized: true
    }))

    app.post('/inAccount', (req, res) => {
        if (!req.session.user) {
            console.log('No such user exists!')
            return res.status(error.NoUserExists).json({ message: 'No such user exists' })
        }
        console.log(`In account request received by ${req.session.user.username}`)
        return res.status(200).json({ username: req.session.user.username })
    })

    app.post('/createUser', (req, res) => {
        let form = new multiparty.Form()
        let data = {}

        form.parse(req, (err, fields) => {
            Object.keys(fields).forEach((prop) => {
                data[prop] = fields[prop].toString()
            })
            var newUser
            if ('username' in data) {
                if ((newUser = user.createUser(data['username'])) != null) {
                    console.log(`Created new user ${data['username']}`)
                    newUser.print()
                    req.session.user = newUser
                    return res.status(200).json({
                        username: newUser.username,
                        status: newUser.status
                    })
                }
            }
        })
    })

    app.post('/login', (req, res) => {
        let form = new multiparty.Form()
        let data = {}

        form.parse(req, (err, fields) => {
            if (err) {
                console.log(err)
                return
            }

            Object.keys(fields).forEach((prop) => {
                data[prop] = fields[prop].toString()
            })

            console.log('Log in request received')
            console.log(data)

            if (!'username' in data) return

            if (user.findUserByName(data['username']) != null) {
                req.session.user = user.findUserByName(data['username'])
                return res.status(200).json({ username: data['username'] })
            }

            console.log(`Username ${data['username']} not found`)

            return res.status(400).json({})
        })
    })

    app.post('/logout', (req, res) => {
        console.log('Logout request received')
        req.session.destroy()
        return res.status(200).json({})
    })
}