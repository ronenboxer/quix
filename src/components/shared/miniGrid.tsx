import { makeId } from "@/services/util.service"
import { CSSProperties } from "react"

const MAX_COUNT = 3
const BORDER_WIDTH = '1px'
const BORDER_COLOR = '#333'
const BORDER_RADIUS = '2px'

interface MiniGridProps {
    rows: number
    cols: number
    custom?: boolean
    styles?: CSSProperties
    isSelected?:boolean
}

export default function MiniGrid(props: MiniGridProps) {
    const { rows, cols, styles = {}, custom = false, isSelected=false } = props
    const actualCols = Math.min(cols, MAX_COUNT)
    const actualRows = Math.min(rows, MAX_COUNT)

    if (actualCols === 1 && actualRows === 1) return (<div style={{
        width: '100%',
        height: '100%',
        borderRadius: BORDER_RADIUS,
        borderWidth: BORDER_WIDTH,
        borderStyle: 'solid',
        ...styles
    }}></div>)

    if (custom || (actualCols === MAX_COUNT && actualRows === MAX_COUNT)) return (<div 
        className={`${isSelected && 'selected'} mini-grid`}
        style={{
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateColumns: `repeat(${MAX_COUNT}, 1fr)`,
        gridTemplateRows: `repeat(${MAX_COUNT}, 1fr)`,
        ...styles
    }}>
        <div style={{
            gridColumn: '1 / -1',
            gridRow: '1/2',
            display: 'grid',
            gridTemplateColumns: `repeat(${MAX_COUNT}, 1fr)`,
            borderTopLeftRadius: BORDER_RADIUS,
            borderTopRightRadius: BORDER_RADIUS,
            borderWidth: BORDER_WIDTH,
            borderTopStyle: 'solid',
            borderRightStyle: 'solid',
            borderLeftStyle: 'none',
            borderBottomStyle: 'none',
            overflow: 'hidden',
            ...styles
        }}>
            {Array(MAX_COUNT).fill(null).map((_, idx) => <div key={makeId()} style={{
                borderWidth: BORDER_WIDTH,
                borderLeftStyle: idx > 0
                    ? 'solid'
                    : 'none',
                borderBottomStyle: 'solid',
                ...styles
            }}></div>)}
        </div>
        <div style={{
            gridRow: '1 / -1',
            gridColumn: '1/2',
            width: 'calc(100% + .5px)',
            display: 'grid',
            gridTemplateRows: `repeat(${MAX_COUNT}, 1fr)`,
            borderTopLeftRadius: BORDER_RADIUS,
            borderBottomLeftRadius: BORDER_RADIUS,
            borderWidth: BORDER_WIDTH,
            borderStyle: 'solid',
            borderRightStyle: 'none',
            overflow: 'hidden',
            ...styles
        }}>
            {Array(MAX_COUNT).fill(null).map((_, idx) => <div key={makeId()} style={{
                borderWidth: BORDER_WIDTH,
                borderTopStyle: idx > 1
                    ? 'solid'
                    : 'none',
                borderRightStyle: 'solid',
                ...styles
            }}></div>)}
        </div>
        <div style={{
            gridColumn: '2 / -1',
            gridRow: '2 / -1',
            borderWidth: BORDER_WIDTH,
            borderRightStyle: 'dashed',
            borderBottomStyle: 'dashed',
            borderBottomRightRadius: BORDER_RADIUS,
            ...styles
        }}></div>
    </div>)

    const gridBorderBottomStyle = rows > actualRows
        ? 'none'
        : 'solid'
    const gridBorderRightStyle = cols > actualCols
        ? 'none'
        : 'solid'
    const gridBorderBottomLeftRadius = rows > actualRows && cols <= actualCols
        ? '0'
        : BORDER_RADIUS
    const gridBorderBottomRightRadius = (rows > actualRows || cols > actualCols) && !(rows > actualRows && cols > actualCols)
        ? '0'
        : BORDER_RADIUS
    const gridBorderTopRightRadius = cols > actualCols && rows <= actualRows
        ? '0'
        : BORDER_RADIUS

    function getGridCells() {
        const grid: JSX.Element[][] = []
        for (let i = 0; i < actualRows; i++) {
            grid[i] = []
            for (let j = 0; j < actualCols; j++) {
                grid[i][j] = <span
                    style={{
                        width: '100%',
                        height: '100%',
                        borderWidth: BORDER_WIDTH,
                        borderBottomStyle: i < actualRows - 1 || (actualRows > 1 && actualRows !== rows)
                            ? 'solid'
                            : 'none',
                        borderRightStyle: j < actualCols - 1 || (actualCols > 1 && actualCols !== cols)
                            ? 'solid'
                            : 'none',
                        display: 'block',
                        ...styles
                    }}
                    key={makeId()}></span>

            }
        }
        return grid
    }
    return (<div 
        className={`mini-grid ${isSelected && 'selected'}`}
        style={{
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateColumns: actualCols < cols
            ? `${actualCols}fr 1fr`
            : '1fr',
        gridTemplateRows: actualRows < rows
            ? `${actualRows}fr 1fr`
            : '1fr',
        overflow: 'hidden',
        borderTopLeftRadius: BORDER_RADIUS,
        borderTopRightRadius: gridBorderTopRightRadius,
        borderBottomRightRadius: gridBorderBottomRightRadius,
        borderBottomLeftRadius: gridBorderBottomLeftRadius,
    }}>
        <div style={{
            width: '100%',
            height: '100%',
            display: 'grid',
            gridTemplateColumns: `repeat(${actualCols}, 1fr)`,
            gridTemplateRows: `repeat(${actualRows}, 1fr)`,
            gap: 0,
            borderTopLeftRadius: BORDER_RADIUS,
            borderTopRightRadius: gridBorderTopRightRadius,
            borderBottomRightRadius: gridBorderBottomRightRadius,
            borderBottomLeftRadius: gridBorderBottomLeftRadius,
            borderWidth: BORDER_WIDTH,
            borderTopStyle: 'solid',
            borderLeftStyle: 'solid',
            borderBottomStyle: gridBorderBottomStyle,
            borderRightStyle: gridBorderRightStyle,
            ...styles
        }}>
            {getGridCells()}
        </div>
        {rows > actualRows && <div
            className="dashed-mini-grid relative vertical-border"
            style={{
                borderWidth: BORDER_WIDTH,
                borderInlineStyle: 'none',
                ...styles
            }}></div>}
        {cols > actualCols && <div
            className="dashed-mini-grid relative horizontal-border"
            style={{
                borderWidth: BORDER_WIDTH,
                borderBlockStyle: 'none',
                ...styles
            }}></div>}
    </div>)
}