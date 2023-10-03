export interface ICloseButtonProps {
  onClick?: () => void
}

export default function CloseButton({ onClick }: ICloseButtonProps) {
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }
  return <button className="btn-close position-absolute top-0 start-100 p-2"
    style={{ transform: "translateX(-100%)" }} onClick={handleClick} />
}
