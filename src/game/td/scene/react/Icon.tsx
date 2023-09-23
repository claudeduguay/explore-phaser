import React, { CSSProperties } from "react"

export type IIconType = "outlined" | "filled" | "rounded" | "sharp" | "two-tone"

export interface IIconProps {
  extraClass?: string;
  style?: CSSProperties;
  type?: IIconType;
  icon: string;
  size?: "sm" | "lg" | "tiny"
}

export default function Icon({ icon, type, size, extraClass: extraClassName, style }: IIconProps) {
  style = { ...style, fontSize: 24 }
  if (size === "tiny") {
    style.fontSize = 16
  }
  if (size === "sm") {
    style.fontSize = 18
  }
  if (size === "lg") {
    style.fontSize = 36
  }
  const extraClass = " " + extraClassName || ""
  const suffix = (type ? "-" + type : "")
  const className = `material-icons${suffix} ${extraClass}`
  return <span style={style} className={className}>{icon}</span>
}
