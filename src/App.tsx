import React, { useState } from 'react'
import "bootstrap"
import "bootstrap/dist/css/bootstrap.css"
import './App.css'
import Explore from './game/Explore'
import DungeonGen from './game/dungeon/DungeonGen'
import { Scene } from 'phaser'
import ScanScene from './game/scan/ScanScene'
import TileScene from './game/tiles/TileScene'
import TDGame from './game/td/TDGame'

export default function App() {
  const [scene, setScene] = useState<Scene>(new TDGame())
  const onSelect = (sceneName: string) => {
    switch (sceneName) {
      case "dungeon":
        setScene(new DungeonGen())
        break
      case "scan":
        setScene(new ScanScene())
        break
      case "tile":
        setScene(new TileScene())
        break
      case "td":
        setScene(new TDGame())
        break
    }
  }
  return (
    <div className="p-0 m-0">
      <center>
        <h1>Explore Phaser 3 in React</h1>
        <Explore w={1100} h={800} scene={scene} />
        <nav className="btn-group m-2">
          <button className="btn btn-primary" onClick={() => onSelect("dungeon")}>Dungeon Generator</button>
          <button className="btn btn-primary" onClick={() => onSelect("scan")}>Scan Scene</button>
          <button className="btn btn-primary" onClick={() => onSelect("tile")}>Tile Scene</button>
          <button className="btn btn-primary" onClick={() => onSelect("td")}>Tower Defense</button>
        </nav>
        <p>The Explore component encapsulates the <b><code>Phaser.Game</code></b> initialization.</p>
      </center>
    </div>
  )
}
