import INavigator from "./INavigator"

export interface IGameHomeProps {
  navigator: INavigator
}

export default function GameHeader({ navigator }: IGameHomeProps) {
  const onPlay = () => navigator.transitionTo("play", "home")
  return <div className="d-flex justify-content-center align-items-center" style={{ width: 1100, height: 800, background: "black" }}>
    <div className="p-2 text-white container">
      <div className="p-2">
        <h1>Tower Defender</h1>
        <p className="p-2">Welcome to my first Phaser 3 project. This is a basic Tower Defense game.</p>
      </div>
      <div className="p-2">
        <button className="btn btn-primary col-4" onClick={onPlay}>Play</button>
      </div>
      <div className="p-2">
        <button className="btn btn-primary col-4" onClick={() => console.log("Continue")}>Continue</button>
      </div>
      <div className="p-2">
        <button className="btn btn-primary col-4" onClick={() => console.log("Options")}>Options</button>
      </div>
      <div className="p-2">
        <button className="btn btn-primary col-4" onClick={() => console.log("About")}>About</button>
      </div>
      <div className="p-2">
        <button className="btn btn-primary col-4" onClick={() => console.log("Quit")}>Quit</button>
      </div>
    </div>
  </div>
}