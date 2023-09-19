import PropsTable, { IValueFormatter } from "./PropsTable"

export interface IPropsInfoProps {
  valueFormatter?: IValueFormatter
  title?: string
  model: any
}

export default function PropsInfo({ title, model, valueFormatter }: IPropsInfoProps) {
  return <div className="rounded py-0 m-2 mb-3 bg-overlay">
    {title && <div className="border-bottom border-secondary p-1 fs-4 text-title">{title}</div>}
    <PropsTable model={model} valueFormatter={valueFormatter} />
  </div>
}
