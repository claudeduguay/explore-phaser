import Icon from "./Icon";

export interface IIConButtonProps {
  icon: string
  onClick?: () => void
}

export default function IconButton({ icon, onClick }: IIConButtonProps) {
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }
  return <button className="btn btn-primary" onClick={handleClick}>
    <Icon icon={icon} style={{ color: "white", fontSize: 22 }} />
  </button>
}