import React from 'react'
// import logo from './logo.svg';
import "bootstrap"
import './App.css'
import Explore from './game/Explore'

export default function App() {
  return (
    <div className="p-0 m-0">
      <center>
        <h1>Explore Phaser 3 in React</h1>
        <Explore w={1100} h={800} />
        <p>The Explore component encapsulates the <b><code>Phaser.Game</code></b> initialization.</p>
      </center>
    </div>
  )
}
