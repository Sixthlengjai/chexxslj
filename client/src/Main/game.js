import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { socket } from '../socket.js'

const Game = () => {
    let navigate = useNavigate()
    let location = useLocation()

    const { username, roomID } = location.state
    const [position, setPosition] = useState([
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
    ])

    useEffect(() => {
        if (!location.state) {
            navigate('/main')
        }

        socket.emit('pingGame', { username, roomID }, (response) => {
            if (!response.status) {
                navigate('/main')
            }
        })
    }, [])

    socket.on('getChessboard', (chessboard) => {
        console.log(chessboard)
        setPosition(chessboard)
    })

    return (
        <div className="Game">
            <p>In game</p>
            <table>
                <tbody>
                    {position.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((piece, colIndex) => (
                                <td key={colIndex}>{piece}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Game