// import { GridLayout, SectionType, WapContainerEl, WapSection } from "@/model/wap"
// import { Box } from "@mui/material"
// import React, { useState } from "react"
// import GridSelection from "./gridSelection"

// interface SectionToolbarProps {
//     mousePos: { x: number, y: number }
//     section: WapSection<SectionType>
//     onSetGridLayout: (grid: GridLayout) => void
// }

// export default function SectionToolbar(props: SectionToolbarProps) {
//     const { mousePos, section, onSetGridLayout } = props
//     const [gridOptions, setGridOptions] = useState<([number, number])[]>(gridProps().list)
//     const currOption = gridProps().value

//     function selectGridOptionHandler(idx: number) {
//         const [cols, rows] = gridOptions[idx]
//         const { defaultGridSize } = WapContainerEl
//         debugger
//         const grid: GridLayout = {
//             cols: new Array(cols).fill({...defaultGridSize}),
//             rows: new Array(rows).fill({...defaultGridSize})
//         }
//         onSetGridLayout(grid)
//         gridOptionsHandler()
//     }
//     function gridOptionsHandler() { setGridOptions(gridProps().list) }

//     function gridProps(): {
//         list: [number, number][],
//         value: number
//     } {
//         const { grid: grid } = section
//         const colCount = grid.cols.length || 1
//         const rowCount = grid.rows.length || 1

//         const total = rowCount * colCount
//         if (total === 1) return {
//             list: [[1, 1], [2, 1], [3, 1], [1, 2], [2, 2], [1, 3]],
//             value: 0
//         }
//         else if (rowCount + colCount === total + 1) return {
//             list: [[1, 1], [1, total], [total, 1]],
//             value: colCount === 1
//                 ? 1
//                 : 2
//         }
//         else return {
//             list: rowCount === colCount
//                 ? [[1, 1], [1, total], [colCount, rowCount], [total, 1]]
//                 : [[1, 1], [1, total], [colCount, rowCount], [rowCount, colCount], [total, 1]],
//             value: 2
//         }
//     }

//     function clickHandler(ev: React.MouseEvent) {
//         ev.stopPropagation()
//     }

//     return (
//         <Box
//             onClick={clickHandler}
//             sx={{
//                 position: 'absolute',
//                 top: `calc(${mousePos.y + 'px'} - 50px)`,
//                 left: mousePos.x + 'px',
//                 zIndex: 1000,
//                 borderRadius: '5px',
//                 boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 padding: '4px',
//                 backgroundColor: 'white',
//                 pointerEvents: 'all'
//             }}
//         >
//             <GridSelection
//                 gridOptions={gridOptions}
//                 currOption={currOption}
//                 onSetCurrOption={selectGridOptionHandler}
//             />
//         </Box>
//     )

// }