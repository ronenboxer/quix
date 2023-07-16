import { GridLayout, SectionType, WapContainerEl, WapSection } from "@/model/wap"
import { Box, IconButton } from "@mui/material"
import React, { useEffect, useState } from "react"
import GridSelection from "../containers/grid/gridSelection"
import { DOMGridLayout, ViewMode } from "@/model/DOM"
import CustomGrid from "../containers/grid/customGrid"
import { getMultipliers } from "@/services/util.service"
import { useSvg } from "@/components/shared/useSvg"
import VerticalDivider from "@/components/shared/verticalDivider"

interface SelectedSectionToolbarProps {
    viewMode: null | ViewMode
    onSetViewMode: (mode: null | ViewMode) => void
    mousePos: { x: number, y: number }
    section: WapSection<SectionType>
    onSetGridLayout: (grid: GridLayout) => void
    isGridMode: boolean
    idx: number
    idxCount: number
    bp: number
}

export default function SelectedSectionToolbar(props: SelectedSectionToolbarProps) {
    const { viewMode, onSetViewMode, mousePos, section, onSetGridLayout, isGridMode, idx, idxCount, bp } = props
    const [isCustomGridOptionsOpen, setIsCustomGridOptionsOpen] = useState(false)
    const [gridOptions, setGridOptions] = useState<([number, number])[]>(gridProps().list)
    const currOption = gridProps().value

    function toggleCustomGridHandler(state: boolean) { setIsCustomGridOptionsOpen(state) }
    function viewModeHandler() { onSetViewMode('grid-canvas-edit') }

    function selectGridOptionHandler(option: number | [number, number]) {
        const [cols, rows] = typeof option === 'number'
            ? gridOptions[option]
            : option
        const { defaultGridSize } = WapContainerEl

        const grid: GridLayout = {
            cols: new Array(cols).fill(null).map(_ => ({ ...defaultGridSize })),
            rows: new Array(rows).fill(null).map(_ => ({ ...defaultGridSize }))
        }
        onSetGridLayout(grid)
        toggleCustomGridHandler(false)
        gridOptionsHandler()
    }
    function gridOptionsHandler() { setGridOptions(gridProps().list) }

    function gridProps(): {
        list: [number, number][],
        value: number
    } {
        const { gridColsLayout, gridRowsLayout } = section
        const colCount = gridColsLayout(bp).length || 1
        const rowCount = gridRowsLayout(bp).length || 1

        const total = rowCount * colCount
        if (total === 1) {
            return {
                list: [[1, 1], [2, 1], [3, 1], [1, 2], [2, 2], [1, 3]],
                value: 0
            }
        }
        const list = [[1, 1], ...getMultipliers(total)] as [number, number][]
        const value = list.findIndex(mults => mults[0] === colCount && mults[1] === rowCount)
        return { list, value }
        if (rowCount + colCount === total + 1) return {
            list: [[1, 1], [1, total], [total, 1]],
            value: colCount === 1
                ? 1
                : 2
        }
        else return {
            list: rowCount === colCount
                ? [[1, 1], [1, total], [colCount, rowCount], [total, 1]]
                : [[1, 1], [1, total], [colCount, rowCount], [rowCount, colCount], [total, 1]],
            value: 2
        }
    }

    useEffect(() => {
        setGridOptions(gridProps().list)
    }, [section.gridTemplateCols(bp).length, section.gridTemplateRows(bp).length])

    function getToolbarStyle() {
        const pointerEvents = viewMode === 'grid-canvas-edit'
            ? 'none !important'
            : 'inherit'
        if (!section.isVertical) {
            if (idx === 0) return {
                left: 0,
                top: 'calc(100% + 24px)',
                pointerEvents
            }
            if (idx === idxCount - 1) return {
                left: 0,
                top: isGridMode
                    ? '-78px'
                    : '-54px',
                pointerEvents
            }
        }
        const { x, y } = mousePos
        return {
            top: y + 'px',
            left: x + 'px',
            pointerEvents
        }
    }

    function clickHandler(ev: React.MouseEvent) {
        ev.stopPropagation()
    }

    useEffect(() => {
        // console.log('Edit Section Toolbar')
    }, [])

    return (
        <Box
            onClick={clickHandler}
            className="selected-section-edit-toolbar absolute z-100 flex items-center events-all s-shadow"
            sx={getToolbarStyle()}
        >
            <GridSelection
                gridOptions={gridOptions}
                currOption={currOption}
                onSetCurrOption={selectGridOptionHandler}
                onToggleCustomGrid={toggleCustomGridHandler}
            />
            {isCustomGridOptionsOpen && <CustomGrid
                onToggleCustomGrid={toggleCustomGridHandler}
                cols={section.gridColsLayout(bp).length || 1}
                rows={section.gridRowsLayout(bp).length || 1}
                onSetCustomGrid={selectGridOptionHandler}
            />}
            <VerticalDivider colorClassName="white-500" height={57} styles={{ marginInline: '4px' }} />
            <IconButton className="black-10 ma-4" disabled={viewMode === 'grid-canvas-edit'} onClick={viewModeHandler}>{useSvg('gridCanvasEdit')}</IconButton>
            <VerticalDivider colorClassName="white-500" height={57} styles={{ marginInline: '4px' }} />
            <IconButton className="black-10 ma-4">{useSvg('comments')}</IconButton>
            <IconButton className="black-10 ma-4">{useSvg('help')}</IconButton>
            <IconButton className="black-10 ma-4">{useSvg('...')}</IconButton>
        </Box>
    )

}