import { CSSProperties } from "react"
import { entitle } from "../../../../util/TextUtil"
import UpgradeButton from "./buttons/UpgradeButton"

export type IValueFormatter = (value: any) => string
export interface IUpgrade {
  [key: string]: { text: string, delta?: (value: number) => number, cost: number }
}

export interface IPropsTableProps {
  valueFormatter?: IValueFormatter
  model: any
  upgrade?: IUpgrade
}

export default function PropsTable({ model, upgrade, valueFormatter = value => value.toString() }: IPropsTableProps) {
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
            {upgrade ? <>
              <td className="text-info text-end col-6 px-1" style={cellStyle}>{entitle(key)}: </td>
              <td className="text-success col-2 px-1 fst-italic" style={cellStyle}> {valueFormatter(value)}</td>
              <td className="text-success text-start col-4 text-end" style={cellStyle}>
                <UpgradeButton>{upgrade[key].text} [${upgrade[key].cost}]</UpgradeButton>
              </td></> : <>
              <td className="text-info text-end col-6 px-1" style={cellStyle}>{entitle(key)}: </td>
              <td className="text-success col-6 px-1 fst-italic" style={cellStyle}> {valueFormatter(value)}</td>
            </>
            }
          </tr>
        )}
      </tbody>
    </table>
  </div>
}
