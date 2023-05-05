import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { socket } from '../socket.js'

import './home.css'

const Home = () => {
    let navigate = useNavigate()

    const onSubmitCreateUser = (e) => {
        e.preventDefault()
        const form = document.querySelector('#createForm')

        let body = new FormData(form)

        fetch('/createUser', {
            method: 'POST',
            body: body
        }).then((res) => {
            if (res.ok) {
                navigate('/main')
            }
        }).catch((e) => {
            console.log(e)
        })
    }

    const onClickSignIn = () => { navigate('/login') }

    return (
        <div className="Home">
            <div className="Home-Dialog dialog">
                <form className="createUserForm" action="/createUser" onSubmit={onSubmitCreateUser} method="POST" id="createForm">
                    <input type="text" placeholder="New Username" name="username" required />
                    <input type="submit" value="Create User" />
                </form>
                <p>Already have an account? Then <button onClick={onClickSignIn}>sign in</button> here!</p>
            </div>
        </div>
    )
}

export default Home