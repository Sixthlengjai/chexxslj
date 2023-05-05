import React from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    let navigate = useNavigate()

    const onSubmitLogin = (e) => {
        e.preventDefault()

        const form = document.querySelector('#loginForm')
        let body = new FormData(form)

        fetch('/login', {
            method: 'POST',
            body: body
        }).then((res) => {
            if (res.ok) {
                navigate('/main')
            } else {
                console.log('No such user exists')
            }
        }).catch((e) => {
            console.log(e)
        })
    }

    return (
        <div className="Login">
            <form className="loginForm" id="loginForm" onSubmit={onSubmitLogin}>
                <input type="text" name="username" placeholder="Username" />
                <input type="submit" value="Login" />
            </form>
        </div>
    )
}

export default Login