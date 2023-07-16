import { DragMode, Orientation, PageRefMap, ViewMode } from "@/model/DOM"
import { WapSection, SectionType, WapPage, PageType, GridLayout, WapContainerEl, WapElement, HtmlTags, PageBreakpoint, HtmlContainerTags } from "@/model/wap"
import { Box, Button } from "@mui/material"
import SingleSectionEditToolsOverlay from "./section/singleSectionEditToolsOverlay"
import { useEffect } from "react"
import { WapGridCellSize } from "@/model/wap/misc"
import VerticalDivider from "@/components/shared/verticalDivider"

interface SectionEditToolsOverlayProps {
    viewMode: null | ViewMode
    onSetViewMode: (mode: null | ViewMode) => void
    currBreakpoint: PageBreakpoint
    selectedEl: WapElement<HtmlTags> | WapPage<PageType> | null
    onSelectGridIdx: (idx: number, orientation: Orientation) => void
    onAddGridColOrRow: <T extends WapContainerEl<HtmlContainerTags>>(props: { container: T, bp: number, orientation: Orientation, idx: number }) => void
    pageRefMap: PageRefMap
    currPage: WapPage<PageType>
    containerSize: { x: number, y: number, width: number, height: number }
    innerTopDelta: number
    onSetGridLayout: <T extends WapContainerEl<HtmlContainerTags>>(cont: T, grid: GridLayout, bp: number) => void
    relativeMousePos: { x: number, y: number }
    dragMode: null | DragMode
    editedGrid: null | WapGridCellSize[]
}

export default function SectionEditToolsOverlays(props: SectionEditToolsOverlayProps) {
    const { viewMode, onSetViewMode, currBreakpoint, selectedEl, pageRefMap, containerSize, innerTopDelta, onSetGridLayout, onAddGridColOrRow, relativeMousePos, currPage, onSelectGridIdx, dragMode, editedGrid } = props
    const { x: contX, y: contY, width: contW, height: contH } = containerSize

    const sectionsRef = pageRefMap.sections
    const bp = currBreakpoint.start

    function viewModeHandler(mode: null | ViewMode) { onSetViewMode(mode) }

    function sectionGridLayoutHandler<T extends WapContainerEl<HtmlContainerTags>>(cont: T, grid: GridLayout) {
        onSetGridLayout(cont, grid, bp)
    }
    function selectGridIdxHandler(idx: number, orientation: Orientation) { onSelectGridIdx(idx, orientation) }
    function addGridColOrRowHandler<T extends WapContainerEl<HtmlContainerTags>>(props: { container: T, bp: number, orientation: Orientation, idx: number }){ onAddGridColOrRow(props)}

    function getSectionEditToolsOverlay(section: WapSection<SectionType>) {
        if (!section.type) return
        const sectionRef = sectionsRef[section.id]
        return sectionRef?.ref
            ? <SingleSectionEditToolsOverlay
                viewMode={viewMode}
                onSetViewMode={viewModeHandler}
                key={`section-${section.id}-edit-tools-overlay`}
                section={section}
                sectionRef={sectionRef}
                selectedEl={selectedEl}
                onSelectGridIdx={selectGridIdxHandler}
                innerTopDelta={innerTopDelta}
                onSetGridLayout={sectionGridLayoutHandler}
                onAddGridColOrRow={addGridColOrRowHandler}
                relativeMousePos={relativeMousePos}
                idx={section.isVertical
                    ? currPage.sectionCol(section)
                    : currPage.sectionRow(section)}
                rows={currPage.rowCount}
                cols={currPage.colCount}
                bp={bp}
                dragMode={dragMode}
                editedGrid={editedGrid}
            />
            : null
    }

    useEffect(() => {
        // console.log('SectionEditOverlayTools - many')
    }, [])

    return (
        <Box
            className="sections-edit-tools-overlay-container absolute of-hidden"
            sx={{
                top: contY + 'px',
                left: contX,
                width: contW + 'px',
                height: contH + 'px',
                pointerEvents: 'none',
            }}
        >
            {selectedEl && getSectionEditToolsOverlay(selectedEl as WapSection<SectionType>)}
            {viewMode === 'grid-canvas-edit' && <div className="grid-canvas-resize-toggle white-50-background items-center events-all absolute flex py-0 px-8 z-100">
                <span className="text black-200 fs-12-px me-16 w-max">Drag lines to customize grid - your content will stay in place.</span>
                <VerticalDivider height={46} colorClassName="grey-200"></VerticalDivider>
                <Button className="blue-A700-background mx-4"
                    sx={{
                        color: 'white',
                    }}
                    onClick={() => viewModeHandler(null)}
                >Done</Button>
            </div>}
        </Box>
    )
}