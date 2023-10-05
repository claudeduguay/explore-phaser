import { ReactNode } from "react";
// import INavigator from "../INavigator";

export interface IUpgradeButtonProps {
  className?: string
  // navigator: INavigator
  onClick?: () => void
  children: ReactNode
}

export default function UpgradeButton({ className = "btn btn-sm btn-success pt-0 pb-1 px-2", children, onClick }: IUpgradeButtonProps) {
  const handleClick = () => {
    if (onClick) {
      // navigator.play("cash")
      onClick()
    }
  }
  return <button className={className} onClick={handleClick}>{children}</button>
}
