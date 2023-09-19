import { CSSProperties } from "react"

export function entitle(text: string) {
  return text[0].toUpperCase() + text.substring(1)
}

export type IValueFormatter = (value: any) => string

export interface IPropsTableProps {
  valueFormatter?: IValueFormatter
  model: any
}

export default function PropsTable({ model, valueFormatter = value => value.toString() }: IPropsTableProps) {
  const cellStyle: CSSProperties = {
    color: "white",
    backgroundColor: "transparent",
    border: "none",
    padding: 1,
  }
  return <div className="mx-3 fs-5">
    <table className="table mb-2">
      <tbody>
        {Object.entries(model).map(([key, value]: [string, any], i) =>
          <tr key={i} className="row">
            <td className="text-info text-end col-6 px-1" style={cellStyle}>{entitle(key)}: </td>
            <td className="text-success text-start col-6 px-1 fst-italic" style={cellStyle}> {valueFormatter(value)}</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
}
