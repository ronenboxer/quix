import { WapSection, SectionType, GridLayout, WapContainerEl, WapElement, HtmlTags, PageType, WapPage } from "@/model/wap"
import { Box } from "@mui/material"
import { CSSProperties, useEffect, useMemo, useState } from "react"
import SelectedSectionToolbar from "./selectedSectionToolbar"
import GridHeaders from "./selectedSectionToolbar/gridHeaders"
import { DragMode, Orientation, RefMap, ViewMode } from "@/model/DOM"
import { WapGridCellSize } from "@/model/wap/misc"

interface SingleSectionEditToolsOverlayProps {
    section: WapSection<SectionType>
    viewMode: null | ViewMode
    onSetViewMode: (mode: null | ViewMode) => void
    selectedEl: WapElement<HtmlTags> | WapPage<PageType> | null
    onSelectGridIdx: (idx: number, orientation: Orientation) => void
    sectionRef: RefMap
    innerTopDelta: number
    onSetGridLayout: (section: WapContainerEl | WapSection<SectionType>, grid: GridLayout) => void
    relativeMousePos: { x: number, y: number }
    idx: number
    rows: number
    cols: number
    bp: number
    dragMode: null | DragMode
    editedGrid: null | WapGridCellSize[]
}

export default function SingleSectionEditToolsOverlay(props: SingleSectionEditToolsOverlayProps) {
    const { section, viewMode, onSetViewMode, selectedEl, onSelectGridIdx, sectionRef, innerTopDelta, onSetGridLayout, relativeMousePos, idx, rows, cols, bp, dragMode, editedGrid } = props
    const [isGridMode, setIsGridMode] = useState(section.gridColsLayout(bp).length > 1 ||
        section.gridRowsLayout(bp).length > 1)
    const gridMode = useMemo(() => {
        return section.gridColsLayout(bp).length > 1 ||
            section.gridRowsLayout(bp).length > 1
    }, [section.gridTemplateCols(bp), section.gridTemplateRows(bp)])
    const [isInstructionsHeaderShown, setIsINstructionsHeaderShown] = useState(false)

    function viewModeHandler(mode: null | ViewMode) { onSetViewMode(mode) }

    function gridOptionsHandler(grid: GridLayout) {
        onSetGridLayout(section, grid)
        // if (grid.cols.length > 1 || grid.rows.length > 1) {
        //     setIsGridMode(true)
        // }
        // else setIsGridMode(false)
    }

    function selectGridIdxHandler(idx: number, orientation: 'cols' | 'rows') { onSelectGridIdx(idx, orientation) }

    function getStyle(): CSSProperties {
        const { top, left, height, width } = sectionRef!.ref!.getBoundingClientRect()

        return {
            top: +parseFloat('' + top) + innerTopDelta + 'px',
            left: +parseFloat('' + left) + 'px',
            height, width
        }
    }

    useEffect(() => {
        if (dragMode === 'grid-canvas-edit-rows' || dragMode === 'grid-canvas-edit-cols') setIsINstructionsHeaderShown(false)
        else if (viewMode === 'grid-canvas-edit') setIsINstructionsHeaderShown(true)
    }, [dragMode, viewMode])

    useEffect(() => {
    }, [section.gridColsLayout, section.gridRowsLayout])
    return (
        <Box
            className="single-section-overlay-edit-tools z-10 absolute events-none"
            sx={{
                maxWidth: 'unset !important',
                ...getStyle()
            }}>
            {isInstructionsHeaderShown && <header className="absolute grid-canvas-instructions-header fw-200 fs-10-px py-8 px-12 mt-12 text-center w-max events-none blue-A700 background">
                Drag from the left or upper edges to add new grid lines.
            </header>}
            {selectedEl?.id === section.id && viewMode !== 'grid-canvas-edit' && <SelectedSectionToolbar
                viewMode={viewMode}
                onSetViewMode={viewModeHandler}
                section={section}
                onSetGridLayout={gridOptionsHandler}
                mousePos={relativeMousePos}
                isGridMode={gridMode}
                idx={idx}
                idxCount={
                    section.isVertical
                        ? cols
                        : rows
                }
                bp={bp}
            />}

            {(gridMode && selectedEl?.id === section.id || viewMode === 'grid-canvas-edit') &&
                <GridHeaders
                    viewMode={viewMode}
                    bp={bp}
                    section={section}
                    sectionRef={sectionRef}
                    onSelectGridIdx={selectGridIdxHandler}
                    editedGrid={editedGrid}
                    dragMode={dragMode}
                />}

        </Box>
    )
}