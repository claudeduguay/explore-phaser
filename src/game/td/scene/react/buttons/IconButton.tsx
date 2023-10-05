import Icon from "../Icon";

export interface IIConButtonProps {
  className?: string
  icon: string
  onClick?: () => void
}

export default function IconButton({ className = "btn btn-primary p-1", icon, onClick }: IIConButtonProps) {
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }
  return <button className={className} onClick={handleClick}>
    <Icon icon={icon} style={{ color: "white", fontSize: 22 }} />
  </button>
}