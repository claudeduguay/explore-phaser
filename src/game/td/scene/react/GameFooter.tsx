
export interface IGameFooterProps {

}

export default function GameFooter(props: IGameFooterProps) {
  return <div className="d-flexjustify-content-center p-2" style={{ width: 1100, height: 54 }}>
    <div className="btn-group">
      <button className="btn btn-primary">Laser</button>
      <button className="btn btn-primary">Bullet</button>
      <button className="btn btn-primary">Missile</button>
    </div>
  </div>
}