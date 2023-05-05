import io from 'socket.io-client'

const config = require('./config.js')

const URL = config.serverURL

export const socket = io.connect(URL)