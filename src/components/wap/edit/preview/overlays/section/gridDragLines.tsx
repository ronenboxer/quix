import { DragMode, DOMGridLayout, Orientation, RefMap, ViewMode } from "@/model/DOM";
import { SectionType, WapSection } from "@/model/wap";
import { WapGridCellSize } from "@/model/wap/misc";
import { getAbsoluteGridSizes } from "@/services/util.service";
import { Box } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

interface GridDragLinesProps {
    section: WapSection<SectionType>
    selectedGridIdx: { idx: number, orientation: Orientation }
    sectionRefObj: RefMap
    bp: number
    dragMode: null | DragMode
    viewMode: null | ViewMode
    onSetDragMode: (mode: null | DragMode) => void
    editedGrid: null | WapGridCellSize[]
    onSetDraggedGridIdx: (idX: number) => void
    onSetMouseDragStartPos: (pos: null | { x: number, y: number }) => void
}

const SNAP_DELTA = 10

export default function GridDragLines(props: GridDragLinesProps) {
    const { section, sectionRefObj, bp, selectedGridIdx, dragMode, viewMode, onSetDragMode, editedGrid, onSetDraggedGridIdx, onSetMouseDragStartPos } = props
    const gridTemplateCols = useMemo(() => {
        return dragMode?.includes('cols') && editedGrid
            ? getAbsoluteGridSizes(editedGrid, sectionRefObj.grid.cols.sizeMap)
            : sectionRefObj.grid.cols.absoluteSizes
    }, [editedGrid, sectionRefObj.grid.cols.absoluteSizes, sectionRefObj.grid.rows.absoluteSizes, section.grid(bp).cols, section.grid(bp).rows])
    const gridTemplateRows = useMemo(() => {
        return dragMode?.includes('rows') && editedGrid
            ? getAbsoluteGridSizes(editedGrid, sectionRefObj.grid.rows.sizeMap)
            : sectionRefObj.grid.rows.absoluteSizes
    }, [editedGrid, sectionRefObj.grid.cols.absoluteSizes, sectionRefObj.grid.rows.absoluteSizes, section.grid(bp).cols, section.grid(bp).rows])

    function dragStartHandler(ev: React.MouseEvent) {
        const gridLineEl = (ev.target as HTMLElement)
        if (dragMode || !gridLineEl) return
        const { orientation, idx } = gridLineEl.dataset!
        if (viewMode === 'grid-canvas-edit') onSetDragMode('grid-canvas-edit-' + orientation! as DragMode)
        else onSetDragMode('grid-resize-' + orientation! as DragMode)
        const { clientX: x, clientY: y } = ev
        onSetDraggedGridIdx(+idx! + (viewMode === 'grid-canvas-edit' ? 1 : 0))
        onSetMouseDragStartPos({ x, y })
    }

    useEffect(() => {
        // console.log(section.grid(bp).cols)
    }, [editedGrid, sectionRefObj.grid.cols.absoluteSizes, sectionRefObj.grid.rows.absoluteSizes, section.grid(bp).cols, section.grid(bp).rows])
    return (
        <Box
            className="grid-drag-lines-container w-100 h-100 grid absolute z-40"
            sx={{
                gridTemplateColumns: gridTemplateCols.map(col => col + 'px').join(' '),
                gridTemplateRows: gridTemplateRows.map(col => col + 'px').join(' ')
            }}
        >
            {gridTemplateCols.length > 1 && gridTemplateCols.map((_, idx) =>
                <div
                    key={`grid-drag-col-${idx}`}
                    className={`grid-col-drag-lines flex grid-full-height  ${selectedGridIdx.idx === idx &&
                        selectedGridIdx.orientation == 'cols' && 'selected'}`}
                    style={{
                        gridColumn: `${idx + 1} / ${idx + 2}`,
                    }}
                >
                    {idx < gridTemplateCols.length - 1 && < div
                        data-orientation="cols"
                        data-idx={idx}
                        className="col-line relative h-100 ma-0 ms-auto pa-0 events-all cursor-col-resize"
                        onMouseDown={dragStartHandler}
                    ></div>}

                </div>)
            }
            {
                gridTemplateRows.length > 1 && gridTemplateRows.map((_, idx) =>
                    <div
                        key={`grid-drag-row-${idx}`}
                        className={`grid-row-drag-lines flex grid-full-width ${selectedGridIdx.idx === idx &&
                            selectedGridIdx.orientation == 'rows' && 'selected'}`}
                        style={{
                            gridRow: `${idx + 1} / ${idx + 2}`,
                        }}
                    >
                        {idx < gridTemplateRows.length - 1 && <div
                            data-orientation="rows"
                            data-idx={idx}
                            className="row-line relative w-100 ma-0 mt-auto pa-0 events-all cursor-row-resize"
                            onMouseDown={dragStartHandler}
                        ></div>}

                    </div>)
            }
        </Box >
    )
}