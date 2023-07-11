import { DragMode, Orientation, RefMap, ViewMode } from "@/model/DOM"
import { WapSection, SectionType, WapContainerEl } from "@/model/wap"
import { WapGridCellSize } from "@/model/wap/misc"
import { extractValueAndUnit } from "@/services/util.service"
import { Box, Button, Icon, Typography } from "@mui/material"
import { blue, grey } from "@mui/material/colors"
import { useEffect, useMemo, useRef } from "react"

interface GridHeadersProps {
    viewMode: null | ViewMode
    section: WapSection<SectionType>
    bp: number
    onSelectGridIdx: (idx: number, orientation: Orientation) => void
    sectionRef: RefMap
    dragMode: null | DragMode
    editedGrid: null | WapGridCellSize[]
}

export default function GridHeaders(props: GridHeadersProps) {
    const { viewMode, section, bp, sectionRef, onSelectGridIdx, dragMode, editedGrid } = props

    const headersRef = useRef<{
        [T in Orientation]: number[]
    }>({
        cols: [],
        rows: []
    })

    const cols = useMemo(() => {
        if (dragMode?.includes('cols') && editedGrid) return WapContainerEl
            .getFormattedGridTemplate(editedGrid
                .filter(cell => cell.value))
        return WapContainerEl
            .getFormattedGridTemplate(section
                .gridColsLayout(bp))
    }, [sectionRef.grid.cols.absoluteSizes, dragMode, editedGrid])

    const rows = useMemo(() => {
        if (dragMode?.includes('rows') && editedGrid) return WapContainerEl
            .getFormattedGridTemplate(editedGrid
                .filter(cell => cell.value))
        return WapContainerEl
            .getFormattedGridTemplate(section
                .gridRowsLayout(bp))
    }, [sectionRef.grid.rows.absoluteSizes, dragMode, editedGrid])

    function getFormattedHeader(header: string) {
        if (!header.includes('minmax')) {
            const { size, unit } = extractValueAndUnit(header, 1)
            return size + unit
        }
        const values = header.replace('minmax(', '').replace(')', '').split(',')
        const formattedValues = [
            extractValueAndUnit(values[0], 0),
            extractValueAndUnit(values[1], 0)
        ]
        return `minmax(${formattedValues[0].size + formattedValues[0].unit}, ${formattedValues[1].size + formattedValues[1].unit})`
    }

    function addGridItemHandler(ev: React.MouseEvent, orientation: 'cols' | 'rows', idx: number) {
        ev.stopPropagation()
        console.log(orientation, idx)
    }

    function selectGridIdxHandler(ev: React.MouseEvent, idx: number, orientation: 'cols' | 'rows') {
        ev.stopPropagation()
        if (viewMode === 'grid-canvas-edit') return
        onSelectGridIdx(idx, orientation)
    }

    function getAddGridButton(orientation: 'cols' | 'rows', isFirst: boolean, gridIdx: number) {
        return <Button
            className={`add-grid-button ${isFirst ? 'first' : "second"} absolute z-31 translate-center hide flex center pa-0 ma-0`}
            onClick={ev => addGridItemHandler(ev, orientation, isFirst ? gridIdx : gridIdx + 1)}
            sx={{
                backgroundColor: blue[100],
                '&:hover': {
                    backgroundColor: blue[100]
                }
            }}>
            <Icon className="flex center pa-0 ma-0 fs-080-rem fw-200">
                +
            </Icon>
        </Button>
    }

    function getGridTemplates(orientation: Orientation = 'cols') {
        const isCol = orientation === 'cols'
        return (isCol ? cols : rows).map((header, idx) => {
            return <Box key={`grid-${orientation}-${idx}-${header}`}
                className={`grid-select-idx grid-${orientation}-button events-all
                 lowercase pa-2 w-100 h-100`}
                sx={{
                    minWidth: 0,
                    minHeight: 0
                }}
                onClick={ev => selectGridIdxHandler(ev, idx, orientation)}
                ref={(ref: HTMLElement) => {
                    if (!ref) return
                    headersRef.current[orientation][idx] = ref[isCol ? 'offsetWidth' : 'offsetHeight']
                }}
            >
                <Box className={`header-text relative w-100 h-100 flex center`}
                    sx={{
                        '&:hover': {
                            backgroundColor: viewMode === 'grid-canvas-edit'
                                ? 'inherit'
                                : grey['100']
                        }
                    }}>
                    {viewMode !== 'grid-canvas-edit' && getAddGridButton(orientation, true, idx)}
                    <Typography
                        className={` ${viewMode === 'grid-canvas-edit' ? 'white-500' : 'black-100'} fw-200 fs-075-rem ${!isCol && 'rotate-75'}`}
                        onClick={ev => selectGridIdxHandler(ev, idx, orientation)}>
                        {getFormattedHeader(header)}
                    </Typography>
                    {viewMode !== 'grid-canvas-edit' && getAddGridButton(orientation, false, idx)}
                </Box>
            </Box >
        })
    }

    useEffect(() => {
    }, [sectionRef.grid.rows.absoluteSizes, sectionRef.grid.cols.absoluteSizes, section.grid(bp).cols, section.grid(bp).rows])

    return (
        <>
            <Box
                className={`grid-headers grid-cols z-30 absolute s-shadow w-100 grid  ${viewMode === 'grid-canvas-edit' && 'events-none'}`}
                sx={{
                    gridTemplateColumns: cols.join(' '),
                }}
            >
                {getGridTemplates('cols')}
            </Box>
            <Box
                className={`grid-headers grid-rows z-30 absolute s-shadow h-100 grid  ${viewMode === 'grid-canvas-edit' && 'events-none'}`}
                sx={{
                    gridTemplateRows: rows.join(' ')
                }}
            >
                {getGridTemplates('rows')}
            </Box>
        </>
    )
}