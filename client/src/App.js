import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"

import './App.css'
import Home from './Home/home.js'
import Login from './Home/login.js'
import Main from './Main/main.js'

import { socket } from './socket.js'

const App = () => {
  setInterval(() => { socket.emit('pingSocket') }, 5000)
  socket.on('resPingSocket', () => { })
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route path="/main" element={<Main />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
