import { GridLayout, HtmlTags, PageBreakpoint, PageType, SectionType, WapContainerEl, WapElement, WapPage, WapSection } from "@/model/wap"
import React, { useEffect, useRef } from "react"
import { DOMGridLayout, DragMode, Orientation, PageRefMap, ViewMode } from "@/model/DOM"
import SectionHeader from "./section.children/header"
import useOnClickOutside from "@/hooks/useClickOutside"
import { getAbsoluteSize } from "@/services/util.service"
import SingleSectionPreviewOverlay from "./overlays/section/singleSectionPreviewOverlay"
import { WapGridCellSize } from "@/model/wap/misc"

interface EditSectionProps {
    section: WapSection<SectionType>
    pageRefMap: PageRefMap
    col: number
    currPage: WapPage<PageType>
    currBreakpoint: PageBreakpoint
    selectedEl: WapElement<HtmlTags> | WapPage<PageType> | null
    hoveredEl: WapElement<HtmlTags> | null
    onAddSection: (idx: number, sectionType: SectionType, isVertical: boolean, isGlobal: boolean) => void
    onSetSelectedEl: (el: WapElement<HtmlTags> | null | null) => void
    onSetMouseClickPos: (pos: { x: number, y: number }) => void
    mouseClient: { x: number, y: number }
    selectedGridIdx: { orientation: Orientation, idx: number }
    viewMode: null | ViewMode
    dragMode: null | DragMode
    editedGrid: null | WapGridCellSize[]
    onSetDragMode: (mode: null | DragMode) => void
    draggedGridIdx: number
    onSetDraggedGridIdx: (idX: number) => void
    mouseDragStartPos: null | { x: number, y: number }
    onSetMouseDragStartPos: (pos: null | { x: number, y: number }) => void
    sectionContainerSize: { x: number, y: number, width: number, height: number }
}

export default function EditSection(props: EditSectionProps) {
    const { section, pageRefMap, col, currBreakpoint, selectedEl, hoveredEl, onSetSelectedEl, onSetMouseClickPos: onSetMouseRelativePos, mouseClient, currPage, selectedGridIdx, viewMode, editedGrid, dragMode, onSetDragMode, draggedGridIdx, onSetDraggedGridIdx, mouseDragStartPos, onSetMouseDragStartPos, onAddSection, sectionContainerSize } = props
    const sectionRef = useRef<HTMLElement>(null)
    const cols = currPage.sectionsIds.length
    const rows = currPage.mainColSectionIds.length

    useOnClickOutside(sectionRef, unselectHandler, "click", true)

    const bp = currBreakpoint.start
    const styles = section.styles[Math.max(WapPage.minBreakpoint, bp - 1)]!

    function selectHandler(ev: React.MouseEvent) {
        ev.stopPropagation()
        if (viewMode === 'grid-canvas-edit') return
        const { clientX: x, clientY: y } = ev.nativeEvent
        const { top, left } = sectionRef.current!.getBoundingClientRect()
        onSetMouseRelativePos({ x: x - left, y: y - top })
        onSetSelectedEl(section)
    }
    function unselectHandler(ev: MouseEvent) {
        ev.stopPropagation()
        if (viewMode === 'grid-canvas-edit') return
    }
    function addSectionHandler(idx: number, sectionType: SectionType, isVertical: boolean, isGlobal: boolean = false) {
        if (viewMode === 'grid-canvas-edit') return
        onAddSection(idx, sectionType, isVertical, isGlobal)
    }
    function dragModeHandler(mode: DragMode | null) { onSetDragMode(mode) }
    function draggedGridIdxHandler(idx: number) { onSetDraggedGridIdx(idx) }
    function mouseDragStartPosHandler(pos: null | { x: number, y: number }) { onSetMouseDragStartPos(pos) }

    function sectionRefHandler(ref: HTMLElement | null) {
        if (!pageRefMap || !ref || dragMode) return

        const { sizeMap: colMap, totalUnits: colUnits, absoluteSizes: colSizes, cumulativeSizes: colCumulativeSizes } = getAbsoluteSize(ref.offsetWidth || 0, section.gridTemplateCols(bp))
        const { sizeMap: rowMap, totalUnits: rowUnits, absoluteSizes: rowSizes, cumulativeSizes: rowCumulativeSizes } = getAbsoluteSize(ref.offsetHeight || 0, section.gridTemplateRows(bp))
        pageRefMap.sections[section.id] = {
            ref,
            grid: {
                cols: {
                    ...{ sizeMap: colMap, totalUnits: colUnits, absoluteSizes: colSizes, cumulativeSizes: colCumulativeSizes },
                    idxs: [-1, -1],
                },
                rows: {
                    ...{ sizeMap: rowMap, totalUnits: rowUnits, absoluteSizes: rowSizes, cumulativeSizes: rowCumulativeSizes },
                    idxs: [-1, -1],
                }
            },
            children: {}
        }
    }

    useEffect(() => {
        sectionRefHandler(sectionRef.current)
    }, [pageRefMap, sectionRef.current, section.gridColsLayout, section.gridColsLayout])

    return (
        <section
            className="section-preview"
            onClick={selectHandler}
            ref={sectionRef}
            style={
                {
                    ...styles,
                    ...section.globalStyles,
                    gridColumn: col + 1 + '/' + +(col + 2),
                    ...section.isVertical
                        ? {
                            gridRow: '1 / -1',
                        }
                        : {},
                    position: 'relative',
                }}
        >
            {viewMode !== 'grid-canvas-edit' && selectedEl?.id !== section.id && hoveredEl?.id === section.id && <SectionHeader
                section={section}
            />}

            {sectionRef.current && <SingleSectionPreviewOverlay
                section={section}
                sectionRefObj={pageRefMap.sections[section.id]!}
                selectedEl={selectedEl}
                hoveredEl={hoveredEl}
                sectionContainerSize={sectionContainerSize}
                mouseClient={mouseClient}
                col={currPage.sectionCol(section)}
                row={currPage.sectionRow(section)}
                cols={cols}
                rows={rows}
                onAddSection={addSectionHandler}
                selectedGridIdx={selectedGridIdx}
                viewMode={viewMode}
                dragMode={dragMode}
                editedGrid={editedGrid}
                onSetDragMode={dragModeHandler}
                draggedGridIdx={draggedGridIdx}
                onSetDraggedGridIdx={draggedGridIdxHandler}
                mouseDragStartPos={mouseDragStartPos}
                onSetMouseDragStartPos={mouseDragStartPosHandler}
                bp={bp}
            />}

            {sectionRef.current && selectedEl?.id === section.id && viewMode === 'grid-canvas-edit' && <></>}
        </section>
    )
}