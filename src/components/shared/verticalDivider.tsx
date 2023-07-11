import { CSSProperties } from "react"

interface VerticalDividerProps {
    colorClassName?: string
    styles?: CSSProperties
    height: number
}

export default function VerticalDivider(props: VerticalDividerProps) {
    const { colorClassName = 'black-10', height, styles = {} } = props
    return (
        <div className="divider-container h-100 mx-2" style={{ height: height + 'px', ...styles }}>
            <div className={`divider h-100 ${colorClassName} background`} style={{ height: height + 'px', ...styles }}></div>
        </div>
    )
}