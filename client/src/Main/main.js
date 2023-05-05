import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { socket } from '../socket.js'

const Main = () => {
    let navigate = useNavigate()

    const [roomsHTML, setRoomsHTML] = useState(null)
    const [username, setUsername] = useState('')

    useEffect(() => {
        fetch('/inAccount', {
            method: 'POST'
        }).then((res) => {
            console.log(res)
            if (res.ok) {
                return res.json()
            } else {
                console.log('No such user exists')
                navigate('/')
            }
        }).then((data) => {
            setUsername(data.username)
            socket.emit('changeUserSocket', data.username)
        })
    }, [])

    const logout = () => {
        fetch('/logout', {
            method: 'POST'
        }).then((res) => {
            if (res.ok) {
                navigate('/')
            }
        })
    }

    const createRoom = () => {
        fetch('/createRoom', {
            method: 'POST',
            body: {
                username: username
            }
        }).then((res) => {
            if (res.ok) {
                return res.json()
            } else {
                alert('Create room failed')
            }
        }).then((data) => {
            console.log(data.roomID)
            joinRoom(data.roomID)
        })
    }

    const joinRoom = (roomID) => {
        fetch('/joinRoom', {
            method: 'POST',
            body: JSON.stringify({
                roomID: roomID
            }),
            headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
            if (res.ok) {
                console.log('Join Room fetch success')
                joinRoomSocket(roomID)
            } else {
                console.log('Join Room fetch failed')
                alert(`Join room failed with server status ${res.status}`)
            }
        })
    }

    const joinRoomSocket = (roomID) => {
        console.log(`Join room socket: ${roomID}`)
        socket.emit('joinRoom', roomID, username)
    }

    socket.on('resJoinRoom', (status, roomID) => {
        console.log(`ResJoinRoom status = ${status}`)
        if (status) {
            navigate('/game')
        } else {
            console.log('Join room failed')
        }
    })

    useEffect(() => {
        const id = setInterval(() => {
            fetch('/requestRoom', {
                method: 'POST'
            }).then((res) => {
                if (res.status !== 200) {
                    console.log(res.status)
                    return
                }
                res.json().then((rooms) => {
                    let html = []
                    for (var room of rooms) {
                        html.push(
                            <div>
                                <div>{room.roomID}</div>
                                <button onClick={() => { joinRoom(room.roomID) }}>Join</button>
                            </div>
                        )
                    }
                    setRoomsHTML(html)
                })
            })
        }, 2000)

        return () => clearInterval(id)
    }, [])

    return (
        <div className="Main">
            <button onClick={logout}>Log out</button>
            <button onClick={createRoom}>Create Room</button>
            <div>{roomsHTML}</div>
        </div>
    )
}

export default Main