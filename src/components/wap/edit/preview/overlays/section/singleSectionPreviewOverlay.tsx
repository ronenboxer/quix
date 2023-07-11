import { HtmlTags, PageType, SectionType, WapElement, WapPage, WapSection } from "@/model/wap";
import { Box } from "@mui/material";
import { blue, lightGreen } from "@mui/material/colors";
import { CSSProperties, useEffect, useMemo, useState } from "react";
import AddSectionButtons from "./addSectionButtons";
import GridDragLines from "./gridDragLines";
import { DragMode, Orientation, RefMap, ViewMode } from "@/model/DOM";
import GridCanvasEdit from "./gridCanvasEdit";
import { WapGridCellSize } from "@/model/wap/misc";

interface SectionOverlayProps {
    section: WapSection<SectionType>
    selectedEl: WapElement<HtmlTags> | WapPage<PageType> | null
    hoveredEl: WapElement<HtmlTags> | null
    sectionRefObj: RefMap
    sectionContainerSize: { x: number, y: number, width: number, height: number }
    mouseClient: { x: number, y: number }
    col: number
    row: number
    cols: number
    rows: number
    selectedGridIdx: { orientation: Orientation, idx: number }
    onAddSection: (idx: number, sectionType: SectionType, isVertical: boolean, isGlobal?: boolean) => void
    viewMode: null | ViewMode
    dragMode: null | DragMode
    onSetDragMode: (mode: null | DragMode) => void
    editedGrid: null | WapGridCellSize[]
    draggedGridIdx: number
    onSetDraggedGridIdx: (idX: number) => void
    mouseDragStartPos: null | { x: number, y: number }
    onSetMouseDragStartPos: (pos: null | { x: number, y: number }) => void
    bp: number
}

export default function SingleSectionPreviewOverlay(props: SectionOverlayProps) {
    const { section, selectedEl, hoveredEl, sectionRefObj, sectionContainerSize, mouseClient, col, row, cols, rows, onAddSection, selectedGridIdx, viewMode, dragMode, onSetDragMode, editedGrid, draggedGridIdx, onSetDraggedGridIdx, mouseDragStartPos, onSetMouseDragStartPos, bp } = props
    const [isHeaderShown, setIsHeaderShown] = useState(false)
    const isGrid = useMemo(() => {
        return section.grid(bp).cols.length || section.grid(bp).rows.length
    }, [section.grid(bp).cols, section.grid(bp).rows])

    function addSectionHandler(idx: number, sectionType: SectionType, isVertical: boolean, isGlobal: boolean = false) {
        onAddSection(idx, sectionType, isVertical, isGlobal)

    }

    function dragModeHandler(mode: DragMode | null) { onSetDragMode(mode) }
    function mouseDragStartPosHandler(pos: null | { x: number, y: number }) { onSetMouseDragStartPos(pos) }
    function draggedGridIdxHandler(idx: number) { onSetDraggedGridIdx(idx) }

    function getStyle(): CSSProperties {
        const color = section.isGlobal
            ? lightGreen['A700']
            : blue['A700']
        if (selectedEl?.id === section.id && viewMode === 'grid-canvas-edit') return {
            borderColor: 'transparent ' + color + ' ' + color + ' transparent',
            borderWidth: '1px',
            borderStyle: 'solid',
        }
        if (viewMode === 'grid-canvas-edit') return {}
        return {
            borderColor: (selectedEl?.id === section.id || hoveredEl?.id === section.id)
                ? color
                : 'transparent',
            borderWidth: '1px',
            borderStyle: 'solid',
            backgroundColor: section.isGlobal && section.id !== selectedEl?.id && hoveredEl?.id === section.id
                ? lightGreen['A700'] + '1f'
                : 'none'
        }
    }

    // function isGrid() { return section.gridColsLayout(bp).length || section.gridRowsLayout(bp).length }

    useEffect(() => {
        // console.log('SingleSectionPreviewOverlay')
        if (!selectedEl) setIsHeaderShown(true)
        else if (isHeaderShown && selectedEl instanceof WapElement &&
            (section.id === selectedEl.id ||
                selectedEl.sectionId === section.id)) setIsHeaderShown(false)

    }, [section, section.grid(bp).cols, section.grid(bp).rows, sectionRefObj.grid.cols.absoluteSizes, sectionRefObj.grid.rows.absoluteSizes, selectedEl, hoveredEl])

    return (
        <Box
            className="single-section-overlay-preview z-10 absolute events-none w-100 h-100"
            sx={{
                ...getStyle()
            }}
        >
            {viewMode !== 'grid-canvas-edit' && selectedEl instanceof WapElement && <AddSectionButtons
                section={section}
                sectionRef={sectionRefObj.ref!}
                selectedEl={selectedEl}
                hoveredEl={hoveredEl}
                mouseClient={mouseClient}
                sectionContainerSize={sectionContainerSize}
                row={row}
                col={col}
                cols={cols}
                rows={rows}
                onAddSection={addSectionHandler}
            />}
            {selectedEl?.id === section.id && isGrid && <GridDragLines
                bp={bp}
                section={section}
                selectedGridIdx={selectedGridIdx}
                sectionRefObj={sectionRefObj}
                dragMode={dragMode}
                viewMode={viewMode}
                onSetDragMode={dragModeHandler}
                editedGrid={editedGrid}
                onSetDraggedGridIdx={draggedGridIdxHandler}
                onSetMouseDragStartPos={mouseDragStartPosHandler}
            />}
            {selectedEl?.id === section.id && viewMode === 'grid-canvas-edit' &&
                <GridCanvasEdit
                    container={section}
                    containerObjectRef={sectionRefObj}
                    dragMode={dragMode}
                    mouseClient={mouseClient}
                    mouseDragStartPos={mouseDragStartPos}
                    editedGrid={editedGrid}
                    draggedGridIdx={draggedGridIdx}
                    onSetDraggedGridIdx={draggedGridIdxHandler}
                    onSetDragMode={dragModeHandler}
                />}
        </Box>
    )
}