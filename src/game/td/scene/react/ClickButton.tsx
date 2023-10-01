import { ReactNode } from "react";
import INavigator from "./INavigator";

export interface IClickButtonProps {
  className?: string
  navigator: INavigator
  onClick?: () => void
  children: ReactNode
}

export default function ClickButton({ className = "btn btn-primary col-4", navigator, children, onClick }: IClickButtonProps) {
  const handleClick = () => {
    if (onClick) {
      navigator.play("click")
      onClick()
    }
  }
  return <button className="btn btn-primary col-4" onClick={handleClick}>{children}</button>
}
