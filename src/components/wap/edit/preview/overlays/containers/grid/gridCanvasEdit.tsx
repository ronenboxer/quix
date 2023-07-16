import { DragMode, Orientation, RefMap } from "@/model/DOM"
import { HtmlContainerTags, SectionType, WapContainerEl, WapSection } from "@/model/wap"
import { WapGridCellSize } from "@/model/wap/misc"
import { useEffect, useState } from "react"

interface GridCanvasEditProps<T extends WapContainerEl<HtmlContainerTags>> {
    container: T
    containerObjectRef: RefMap
    dragMode: null | DragMode
    mouseClient: { x: number, y: number }
    mouseDragStartPos: null | { x: number, y: number }
    editedGrid: null | WapGridCellSize[]
    onSetDragMode: (mode: null | DragMode) => void
    draggedGridIdx: number
    onSetDraggedGridIdx: (idx: number) => void
}

export default function GridCanvasEdit<T extends WapContainerEl<HtmlContainerTags>>(props: GridCanvasEditProps<T>) {
    const { container, containerObjectRef, dragMode, mouseClient, mouseDragStartPos, editedGrid, onSetDragMode, draggedGridIdx, onSetDraggedGridIdx } = props

    const x = mouseDragStartPos && mouseClient && dragMode === 'grid-canvas-edit-cols' && draggedGridIdx === 0
        ? Math.min(Math.max(mouseClient.x - mouseDragStartPos.x, 0), containerObjectRef.ref!.offsetWidth - 3)
        : 0
    const y = mouseDragStartPos && mouseClient && dragMode === 'grid-canvas-edit-rows' && draggedGridIdx === 0
        ? Math.min(Math.max(mouseClient.y - mouseDragStartPos.y, 0), containerObjectRef.ref!.offsetHeight - 3)
        : 0

    function dragModeHandler(mode: null | DragMode) { onSetDragMode(mode) }

    function grabberMouseDownHandler(orientation: Orientation, idx: number = 0) {
        onSetDragMode('grid-canvas-edit-' + orientation as DragMode)
        onSetDraggedGridIdx(idx)
        // console.log('grid-canvas-edit-' + orientation)
    }

    return (
        <div className={`grid-canvas-edit relative w-100 h-100  ${(dragMode === 'grid-canvas-edit-rows' ||
            dragMode === 'grid-canvas-edit-cols') && 'drag-mode'} `}>

            <div className={`container-frame relative ${dragMode === 'grid-canvas-edit-cols' || dragMode === 'grid-canvas-edit-rows' ? 'blue-50' : 'blue-100'} border w-100 h-100`}></div>
            <div
                className={`new-grid-row grabber ${dragMode !== 'grid-canvas-edit-cols' && 'cursor-row-resize'} cur w-100 absolute z-11 events-all ${dragMode === 'grid-canvas-edit-cols' && 'disabled'}`}
                data-orientation="rows"
                data-idx="0"
                onMouseDown={() => grabberMouseDownHandler('rows', 0)}
                style={{
                    top: y + 'px',
                }}
            ></div>
            <div
                className={`new-grid-col grabber ${dragMode !== 'grid-canvas-edit-rows' && 'cursor-col-resize'} h-100 absolute z-11 events-all ${dragMode === 'grid-canvas-edit-rows' && 'disabled'}`}
                data-orientation="cols"
                data-idx="0"
                onMouseDown={() => grabberMouseDownHandler('cols', 0)}
                style={{
                    left: x + 'px',
                }}
            ></div>
        </div>)
}