import { GridLayout, HtmlTags, PageBreakpoint, PageType, SectionType, SizeMap, SizeUnit, Wap, WapContainerEl, WapElement, WapPage, WapSection } from "@/model/wap"
import { Box, Container, Typography } from "@mui/material"
import React, { useEffect, useMemo, useRef, useState } from "react"
import EditSection from "./preview/section"
import PageUnderlay from "./preview/pageUnderlay"
import { DOMGridLayout, DragMode, Orientation, PageRefMap, ViewMode } from "@/model/DOM"
import SectionsPreviewOverlays from "./preview/overlays/sectionsPreviewOverlays"
import useEventListener from '@/hooks/useEventListener'
import SectionEditToolsOverlays from "./preview/overlays/sectionsEditToolsOverlays"
import { SNAP_DELTA } from "@/model/DOM/units"
import { getAbsoluteGridSizes, getAbsoluteSize, getElementRefById } from "@/services/util.service"
import { WapGridCellSize, WapSectionType } from "@/model/wap/misc"

interface WapEditPreviewProps {
    wap: Wap
    pageRefMap: PageRefMap
    onSetWapEditPreviewRef: (ref: HTMLElement | null) => void
    currPage: WapPage<PageType>
    currBreakpoint: PageBreakpoint
    currScreenWidth: number
    onSetCurrScreenWidth: (width: number) => void
    selectedEl: WapElement<HtmlTags> | WapPage<PageType> | null
    onSetSelectedEl: (el: WapElement<HtmlTags> | WapPage<PageType> | null) => void
    selectedGridIdx: { orientation: Orientation, idx: number }
    onSelectGridIdx: (idx: number, orientation?: Orientation) => void
    onAddSection: (idx: number, sectionType: SectionType, isVertical: boolean, isGlobal: boolean) => void
    onSetGridLayout: (cont: WapContainerEl | WapSection<SectionType>, grid: GridLayout, bp: number) => void
    onUpdateGridLayout: (props: {
        container: WapContainerEl | WapSection<SectionType>
        orientation: Orientation
        gridLayout: WapGridCellSize[]
        bp: number
    }) => void
}

export default function WapEditPreview(props: WapEditPreviewProps) {
    // PROPS
    const { wap, pageRefMap, currPage, currBreakpoint, onSetWapEditPreviewRef, currScreenWidth, onSetCurrScreenWidth, selectedEl, onSetSelectedEl, selectedGridIdx, onSelectGridIdx, onAddSection, onSetGridLayout, onUpdateGridLayout } = props
    const bp = currBreakpoint.start

    // Model
    const [hoveredEl, setHoveredEl] = useState<WapElement<HtmlTags> | null>(null)
    const [scrollAmount, setScrollAmount] = useState({ x: 0, y: 0 })

    // Mods
    const [viewMode, setViewMode] = useState<null | ViewMode>(null)

    // Refs
    const wapEditPreviewRef = useRef<HTMLElement>(null)

    // Mouse control
    const [mouseClient, setMouseClient] = useState({ x: 0, y: 0 })
    const [lastMouseClickPos, setLastMouseClickPos] = useState({ x: 0, y: 0 })
    const [dragMode, setDragMode] = useState<null | DragMode>(null)
    const [mouseDragStartPos, setMouseDragStartPos] = useState<null | { x: number, y: number }>(null)

    // Layout props
    const [draggedGridIdx, setDraggedGridIdx] = useState(-1)
    const [editedGrid, setEditedGrid] = useState<null | WapGridCellSize[]>(null)

    // Sizing
    const pageLinkHeight = 44
    const appBarHeight = 68.5
    const wapEditToolbarHeight = 50
    const marginBlock = 24
    const marginInline = 28
    const [sectionContainerSize, setSectionContainerSize] = useState({ x: 0, y: 0, width: 0, height: 0 })
    const [globalContainerSize, setGlobalContainerSize] = useState({ x: 0, y: 0, width: 0, height: 0 })

    // FUNCTIONS
    // Mods
    function viewModeHandler(mode: null | ViewMode = null) { setViewMode(mode) }

    // Model

    // DOM
    function wapEditPreviewRefHandler(ref: HTMLElement | null) {
        onSetWapEditPreviewRef(wapEditPreviewRef.current)
        sectionContainerSizeHandler()
    }
    function sectionContainerSizeHandler() {
        if (wapEditPreviewRef.current) {
            const sizes = getInnerMainSectionContainerSize()
            setSectionContainerSize(sizes.inner)
            setGlobalContainerSize(sizes.outer)
        }
    }
    function getInnerMainSectionContainerSize() {
        const innerCont = wapEditPreviewRef.current!.parentElement!.parentElement!
        const outerCont = innerCont.parentElement!
        const { x: innerX, y: innerY, width: innerW, height } = innerCont.getBoundingClientRect()
        const { x: outerX, y: outerY, width: outerW, height: outerH } = outerCont.getBoundingClientRect()
        return {
            inner: {
                x: innerX, width: innerW,
                y: innerY + pageLinkHeight,
                height: height - pageLinkHeight
            },
            outer: { x: outerX, y: outerY, width: outerW, height: outerH }
        }

    }

    // Sections
    function selectedElHandler(el: WapElement<HtmlTags> | WapPage<PageType> | null) { onSetSelectedEl(el) }
    function getSections() {
        return currPage.allSections.map(s =>
            <EditSection
                key={s.id}
                section={s}
                pageRefMap={pageRefMap}
                col={currPage.sectionCol(s)}
                currBreakpoint={currBreakpoint}
                selectedEl={selectedEl}
                onSetSelectedEl={selectedElHandler}
                hoveredEl={hoveredEl}
                onSetMouseClickPos={mouseLastClickPosHandler}
                mouseClient={mouseClient}
                currPage={currPage}
                onAddSection={addSectionHandler}
                viewMode={viewMode}
                editedGrid={editedGrid}
                dragMode={dragMode}
                onSetDragMode={dragModeHandler}
                draggedGridIdx={draggedGridIdx}
                onSetDraggedGridIdx={draggedGridIdxHandler}
                mouseDragStartPos={mouseDragStartPos}
                onSetMouseDragStartPos={mouseDragStartPosHandler}
                selectedGridIdx={selectedGridIdx}
                sectionContainerSize={sectionContainerSize}
            />)
    }
    function addSectionHandler(idx: number,
        sectionType: SectionType,
        isVertical: boolean,
        isGlobal: boolean) { onAddSection(idx, sectionType, isVertical, isGlobal) }
    function sectionGridLayoutHandler(cont: WapContainerEl | WapSection<SectionType>, grid: GridLayout, bp: number) {
        onSetGridLayout(cont, grid, bp)
    }
    function mouseLastClickPosHandler(pos: { x: number, y: number }) { setLastMouseClickPos(pos) }
    function selectGridIdxHandler(idx: number, orientation: Orientation = 'cols') { onSelectGridIdx(idx, orientation) }

    // Layout
    function draggedGridIdxHandler(idx: number) { setDraggedGridIdx(idx) }
    function compareAndUpdateGrid() {
        if (!selectedEl) return
        const container = selectedEl as WapContainerEl
        const orientation = dragMode!.replace('grid-resize-', '').replace('grid-canvas-edit-', '') as Orientation

        if ((dragMode === 'grid-canvas-edit-cols' || dragMode === 'grid-canvas-edit-rows') && !draggedGridIdx) {
            // debugger
            const containerRef = getElementRefById(pageRefMap, selectedEl.id)!.map!
            const { top, left } = containerRef.ref!.getBoundingClientRect()
            const diff = orientation === 'cols'
                ? mouseClient!.x - left
                : mouseClient!.y - top
            const res = container.dragNewGridDivider(
                orientation,
                bp,
                orientation === 'cols'
                    ? containerRef!.ref!.offsetWidth
                    : containerRef!.ref!.offsetHeight,
                diff
            )
            if (!res.isAdded) return
            const gridLayout = res.payload || [{ unit: 'fr', value: 1 }]
            onUpdateGridLayout({ container, orientation, bp, gridLayout })
            return
        }

        if (!editedGrid) return
        const originalGrid = container.grid(bp)[orientation]
        if (originalGrid.every(({ value }, idx) => value === editedGrid[idx].value)) return
        const gridLayout = editedGrid.filter(size => size.value)
        onUpdateGridLayout({ container, orientation, bp, gridLayout })
        // onUpdateGridLayout({
        //     container: (selectedEl! as WapContainerEl),
        //     orientation,
        //     sizeMap,
        //     originalGrid,
        //     modifiedGrid,
        //     bp
        // })
    }

    function gridDragHandler(ev: MouseEvent) {
        const contRefObj = getElementRefById(pageRefMap, selectedEl!.id)!.map!
        const container = selectedEl! as WapContainerEl
        const orientation: Orientation = dragMode!.includes('cols')
            ? 'cols'
            : 'rows'
        const isCol = orientation === 'cols'
        const { sizeMap } = contRefObj.grid[orientation]
        const gridLayout = JSON.parse(JSON.stringify(isCol
            ? container.gridColsLayout(bp)
            : container.gridRowsLayout(bp))) as WapGridCellSize[]

        const { clientX: currX, clientY: currY } = ev
        const { x: startX = currX, y: startY = currY } = mouseDragStartPos || {}
        let diff = isCol
            ? currX - startX
            : currY - startY

        const originalCell = container.grid(bp)[orientation][draggedGridIdx]
        const originalValue = originalCell.value * sizeMap[originalCell.unit]

        const nextCell = container.grid(bp)[orientation][draggedGridIdx + 1]
        const nextValue = nextCell.value * sizeMap[nextCell.unit]

        if (diff === 0 || (!ev.altKey && Math.abs(diff) <= SNAP_DELTA)) {
            return setEditedGrid([...gridLayout])
        } else if (diff + originalValue <= 0 ||
            (!ev.altKey && Math.abs(diff + originalValue) <= SNAP_DELTA)) {
            diff = -originalValue
        } else if (!ev.altKey && Math.abs(diff + originalValue - (nextValue + originalValue) / 2) <= SNAP_DELTA) {
            diff = (nextValue + originalValue) / 2 - originalValue
        } else if (diff >= nextValue ||
            (!ev.altKey && Math.abs(nextValue - diff) <= SNAP_DELTA)) diff = nextValue

        gridLayout[draggedGridIdx].value += diff / sizeMap[originalCell.unit]
        gridLayout[draggedGridIdx + 1].value -= diff / sizeMap[nextCell.unit]
        setEditedGrid([...gridLayout])

        // const absoluteSizes = gridDragComparison || contRefObj.grid[orientation].absoluteSizes
        // if (!gridDragComparison) setGridDragComparison([...absoluteSizes])

        // contRefObj.grid[orientation].absoluteSizes[draggedGridIdx] = originalValue + diff
        // contRefObj.grid[orientation].absoluteSizes[draggedGridIdx + 1] = nextValue - diff
        // contRefObj.grid[orientation].absoluteSizes = [...contRefObj.grid[orientation].absoluteSizes]
    }
    function gridCanvasDragHandler(ev: MouseEvent) {
        const contRefObj = getElementRefById(pageRefMap, selectedEl!.id)!.map!
        const { top, left, width, height } = contRefObj.ref!.getBoundingClientRect()
        const container = selectedEl! as WapContainerEl
        const orientation: Orientation = dragMode!.includes('cols')
            ? 'cols'
            : 'rows'
        const isCol = orientation === 'cols'
        const gridLayout = JSON.parse(JSON.stringify(isCol
            ? container.gridColsLayout(bp)
            : container.gridRowsLayout(bp))) as WapGridCellSize[]

        const { cumulativeSizes, sizeMap } = contRefObj.grid[orientation]
        const { clientX: currX, clientY: currY } = ev
        const { x: startX = currX, y: startY = currY } = mouseDragStartPos || {}
        let diff = isCol
            ? currX - startX
            : currY - startY

        if (!draggedGridIdx) {
            if (ev.altKey) return
            if (diff <= SNAP_DELTA) {
                if (isCol) setMouseClient({ x: left, y: currY })
                else setMouseClient({ x: currX, y: top })
                return
            }
            if (gridLayout.length <= 1) {
                if (isCol) {
                    if (Math.abs(left + width / 2 - currX) <= SNAP_DELTA) setMouseClient({ x: left + width / 2, y: currY })
                } else {
                    if (Math.abs(top + height / 2 - currY) <= SNAP_DELTA) setMouseClient({ y: top + height / 2, x: currX })
                }
            } else {
                const divIdx = cumulativeSizes.findIndex(d => d === diff || Math.abs(d - diff) <= SNAP_DELTA)
                if (divIdx !== -1) {
                    if (isCol) setMouseClient({ x: left + cumulativeSizes[divIdx], y: currY })
                    else setMouseClient({ y: top + cumulativeSizes[divIdx], x: currX })
                } else {
                    const nextDivIDx = cumulativeSizes.findIndex(d => d > diff)
                    const nextValue = cumulativeSizes[nextDivIDx]
                    const prevValue = cumulativeSizes[nextDivIDx - 1] || 0
                    const center = (nextValue + prevValue) / 2
                    if (isCol) {
                        if (Math.abs(currX - left - center) <= SNAP_DELTA) setMouseClient({ x: center + left, y: currY })
                    } else {
                        if (Math.abs(currY - top - center) <= SNAP_DELTA) setMouseClient({ y: center + top, x: currX })
                    }
                }
            }
            // const firstCell = gridLayout[0] || { unit: 'fr', value: 1 }
            // let newValue = isCol
            //     ? Math.min(Math.max(currX, contRefObj.ref!.offsetLeft), contRefObj.ref!.offsetLeft + contRefObj.ref!.offsetWidth - 3)
            //     : Math.min(Math.max(currY, contRefObj.ref!.offsetTop), contRefObj.ref!.offsetTop + contRefObj.ref!.offsetHeight - 3)
            // newValue -= isCol
            //     ? contRefObj.ref!.offsetLeft
            //     : contRefObj.ref!.offsetTop
            // gridLayout.unshift({ unit: firstCell.unit, value: newValue / sizeMap[firstCell.unit] })
            // setGridDragComparisonBeta(gridLayout)
            return
        }

        const actualIdx = draggedGridIdx - 1
        const originalValue = cumulativeSizes[actualIdx]
        if (!editedGrid) setEditedGrid([...gridLayout])

        const maxValue = isCol
            ? contRefObj.ref!.offsetWidth
            : contRefObj.ref!.offsetHeight


        let newValue = originalValue + diff
        if (newValue === originalValue || (!ev.altKey && Math.abs(diff) < SNAP_DELTA)) return setEditedGrid(gridLayout)
        if (newValue <= 0 || (!ev.altKey && newValue <= SNAP_DELTA)) newValue = 0
        else if (newValue >= maxValue || (!ev.altKey && Math.abs(newValue - maxValue) <= SNAP_DELTA)) newValue = maxValue

        if (!newValue || newValue === maxValue) {
            const absoluteVal = originalValue - (cumulativeSizes[actualIdx - 1] || 0)
            gridLayout.splice(actualIdx, 1)
            gridLayout[actualIdx].value += absoluteVal / sizeMap[gridLayout[actualIdx].unit]
            return setEditedGrid(gridLayout.length <= 1
                ? [{ unit: 'fr', value: 1 }]
                : gridLayout)
        }

        const nextIdx = cumulativeSizes.findIndex(div => div > newValue)

        const centerDistance = ((cumulativeSizes[nextIdx] || maxValue) + (cumulativeSizes[nextIdx - actualIdx === 1 ? actualIdx - 1 : nextIdx - 1] || 0)) / 2
        const nextValue = cumulativeSizes[nextIdx] || maxValue
        const prevValue = cumulativeSizes[nextIdx - 1] || 0
        if (!ev.ctrlKey && Math.abs(newValue - centerDistance) <= SNAP_DELTA && nextIdx - actualIdx === 1) {
            const currCell = gridLayout[actualIdx]
            const nextCell = gridLayout[actualIdx + 1]
            const absoluteMean = (currCell.value * sizeMap[currCell.unit] + nextCell.value * sizeMap[nextCell.unit]) / 2
            gridLayout[actualIdx].value = absoluteMean / sizeMap[currCell.unit]
            gridLayout[actualIdx + 1].value = absoluteMean / sizeMap[nextCell.unit]
        } else if ((nextIdx !== actualIdx && (newValue === nextValue || (!ev.altKey && Math.abs(newValue - nextValue) <= SNAP_DELTA))) ||
            (nextIdx - 1 !== actualIdx && (newValue === prevValue || (!ev.altKey && Math.abs(newValue - prevValue) <= SNAP_DELTA)))) {
            gridLayout[actualIdx].value += gridLayout[actualIdx + 1].value * sizeMap[gridLayout[actualIdx + 1].unit] / sizeMap[gridLayout[actualIdx].unit]
            gridLayout.splice(actualIdx + 1, 1)
        } else if (nextIdx > actualIdx + 1) {
            const pseudoCenterDistance = (cumulativeSizes[nextIdx] + cumulativeSizes[nextIdx - 1]) / 2
            gridLayout[actualIdx].value += gridLayout[actualIdx + 1].value * sizeMap[gridLayout[actualIdx + 1].unit] / sizeMap[gridLayout[actualIdx].unit]
            if (!ev.altKey && Math.abs(pseudoCenterDistance - newValue) <= SNAP_DELTA) newValue = pseudoCenterDistance
            const totalValue = gridLayout[nextIdx].value
            gridLayout[nextIdx].value = (newValue - cumulativeSizes[nextIdx - 1]) / sizeMap[gridLayout[nextIdx].unit]
            gridLayout.splice(nextIdx + 1, 0, { unit: gridLayout[nextIdx].unit, value: totalValue - gridLayout[nextIdx].value })
            gridLayout.splice(actualIdx + 1, 1)
        } else if (nextIdx < actualIdx) {
            gridLayout[actualIdx + 1].value += gridLayout[actualIdx].value * sizeMap[gridLayout[actualIdx].unit] / sizeMap[gridLayout[actualIdx + 1].unit]
            const centerDistance = (cumulativeSizes[nextIdx] + (cumulativeSizes[nextIdx - 1] || 0)) / 2
            if (!ev.altKey && Math.abs(newValue - centerDistance) <= SNAP_DELTA) newValue = centerDistance
            const formattedDiff = (cumulativeSizes[nextIdx] - newValue) / sizeMap[gridLayout[nextIdx].unit]
            const totalValue = gridLayout[nextIdx].value
            gridLayout[nextIdx].value = formattedDiff
            gridLayout.splice(nextIdx, 0, { unit: gridLayout[nextIdx].unit, value: totalValue - formattedDiff })
            gridLayout.splice(actualIdx + 1, 1)
        } else {
            if (nextIdx === actualIdx) {
                const centerDistance = ((cumulativeSizes[nextIdx + 1] || maxValue) + (cumulativeSizes[nextIdx - 1] || 0)) / 2
                if (!ev.altKey && Math.abs(newValue - centerDistance) <= SNAP_DELTA) diff = centerDistance - originalValue
            }
            gridLayout[actualIdx].value += diff / sizeMap[gridLayout[actualIdx].unit]
            gridLayout[actualIdx + 1].value -= diff / sizeMap[gridLayout[actualIdx + 1].unit]
        }
        setEditedGrid(gridLayout)



        // const existingDivIdx = cumulativeSizes.findIndex(div => div === newValue || (!ev.altKey && Math.abs(div - newValue) <= SNAP_DELTA))
        // if (existingDivIdx === actualIdx) return setGridDragComparisonBeta(gridLayout)
        // if (existingDivIdx !== -1) {
        //     newValue = cumulativeSizes[actualIdx + 1]
        //     if (existingDivIdx > actualIdx) {
        //         gridLayout[actualIdx].value += (newValue - originalValue) / sizeMap[gridLayout[actualIdx].unit]
        //         gridLayout.splice(actualIdx + 1, 1)
        //     } else {
        //         newValue = cumulativeSizes[actualIdx - 1]
        //         gridLayout[actualIdx + 1].value += (originalValue - newValue) / sizeMap[gridLayout[actualIdx + 1].unit]
        //         gridLayout.splice(actualIdx, 1)
        //     }
        //     return setGridDragComparisonBeta(gridLayout)
        // }


        // if (diff + originalValue <= 0 ||
        //     (!ev.altKey && Math.abs(diff + originalValue) <= SNAP_DELTA)) diff = -originalValue
        // if (!ev.altKey && Math.abs(diff) <= SNAP_DELTA) diff = 0
        // if (diff + originalValue >= maxSize ||
        //     (!ev.altKey && Math.abs(diff + originalValue - maxSize) <= SNAP_DELTA)) diff = maxSize - originalValue
        // if (cumulativeSizes.length) {
        //     const closestDivAboveIdx = cumulativeSizes.findIndex(div => div > originalValue + diff)
        //     const divAbove = cumulativeSizes[closestDivAboveIdx] || maxSize
        //     const divBellow = cumulativeSizes[closestDivAboveIdx - 1] || 0
        //     // console.log(divAbove)
        //     if (!ev.altKey && Math.abs(originalValue + diff - divBellow) <= SNAP_DELTA) diff = divBellow - originalValue
        //     if (!ev.altKey && Math.abs(originalValue + diff - divAbove) <= SNAP_DELTA) diff = divAbove - originalValue
        //     if (!ev.altKey && Math.abs((divAbove + divBellow) / 2 - (originalValue + diff)) <= SNAP_DELTA) diff = (divAbove + divBellow) / 2 - originalValue


        //     if (originalValue + diff !== originalValue && (originalValue + diff === divBellow || originalValue + diff === divAbove)) {
        //         gridLayout[draggedGridIdx - 1].value += gridLayout[draggedGridIdx].value
        //         gridLayout[draggedGridIdx].value = 0
        //     } else {
        //         if (closestDivAboveIdx > draggedGridIdx) {
        //             console.log('higher')
        //         }
        //         else if (closestDivAboveIdx + 1 < draggedGridIdx) {
        //             console.log('lower')
        //         }
        //         else {

        //             gridLayout[draggedGridIdx - 1].value += diff / sizeMap[gridLayout[draggedGridIdx - 1].unit]
        //             gridLayout[draggedGridIdx].value -= diff / sizeMap[gridLayout[draggedGridIdx].unit]
        //         }
        //     }
        // } else {
        //     console.log('should not have made it here')

        // }
        // contRefObj.grid[orientation].absoluteSizes = gridLayout.map(size => size.value * sizeMap[size.unit])
        // console.log(gridLayout)
    }

    // MouseHandlers
    function dragModeHandler(mode: DragMode | null) { setDragMode(mode) }
    function mouseDragStartPosHandler(pos: null | { x: number, y: number }) { setMouseDragStartPos(pos) }
    function mouseDownHandler(ev: MouseEvent) {
        const { clientX: x, clientY: y } = ev
        mouseDragStartPosHandler({ x, y })
    }
    function mouseUpHandler(ev: MouseEvent) {
        const { clientX: x, clientY: y } = ev
        if (dragMode === 'grid-resize-cols' || dragMode === 'grid-resize-rows' ||
            dragMode === 'grid-canvas-edit-cols' || dragMode === 'grid-canvas-edit-rows') {
            compareAndUpdateGrid()
        } else if (dragMode === 'grid-canvas-edit-cols' || dragMode === 'grid-canvas-edit-rows') {

        }
        // setTimeout(()=>setDragMode(null),100)
        setDragMode(null)
        mouseDragStartPosHandler(null)
        setEditedGrid(null)
    }
    function mouseMoveHandler(ev: MouseEvent) {
        ev.preventDefault()
        const { clientX: x, clientY: y } = ev
        setMouseClient({ x, y })
        // if (viewMode === 'grid-canvas-edit') return
        if ((dragMode === 'grid-resize-cols' || dragMode === 'grid-resize-rows') && mouseDragStartPos) return gridDragHandler(ev)
        if ((dragMode === 'grid-canvas-edit-cols' || dragMode === 'grid-canvas-edit-rows') && mouseDragStartPos) return gridCanvasDragHandler(ev)

        const { x: contX, width: contW, y: contY, height: contH } = sectionContainerSize
        if (x < contX || y < contY ||
            x > contX + contW ||
            y > contY + contH) setHoveredEl(null)
        else {
            const section = getElUnderMouse({ x, y })
            if (section && hoveredEl?.id !== section.id) setHoveredEl(section)
        }

    }
    function mouseLeaveHandler(ev: React.MouseEvent) {
        if (isMouseWithinGlobalContainer(ev)) return
        if (hoveredEl) setHoveredEl(null)
    }
    function scrollHandler(ev: React.UIEvent) {
        const x = (ev.target! as HTMLElement).scrollLeft
        const y = (ev.target! as HTMLElement).scrollTop
        setScrollAmount({
            x,
            y
        })
        if (dragMode || viewMode === 'grid-canvas-edit') return
        const section = getElUnderMouse(mouseClient)
        if (section && hoveredEl?.id !== section.id) setHoveredEl(section)
    }
    function clickHandler(ev: React.MouseEvent) {
        if (dragMode || viewMode === 'grid-canvas-edit') return
        console.log('hi clicked!')
        const { clientX: x, clientY: y } = ev
        setLastMouseClickPos({ x: ev.nativeEvent.offsetX, y: ev.nativeEvent.offsetY })
        const { x: contX, width: contW, y: contY, height: contH } = sectionContainerSize
        if (x < contX || y < contY ||
            x > contX + contW ||
            y > contY + contH) onSetSelectedEl(currPage)
        else {
            const section = getElUnderMouse({ x, y })
            if (section && selectedEl?.id !== section.id) onSetSelectedEl(section)
            // if (!section) selectedElHandler(currPage)
        }

    }
    function isMouseWithinGlobalContainer(ev: React.MouseEvent) {
        return isTargetWithinGlobalContainer(ev.target as HTMLElement || null)
    }
    function isTargetWithinGlobalContainer(target: HTMLElement | null) {
        return (!target ||
            target.classList.contains('overlay') ||
            target.closest('.overlay') ||
            target.classList.contains('wap-edit-preview') ||
            target.closest('.wap-edit-preview'))
    }

    // Keyboard handlers
    function keydownHandler(ev: KeyboardEvent) {
        if (ev.key === 'Escape') endAllActions()
    }

    // UTILS
    function getElUnderMouse({ x, y }: { x: number, y: number }) {
        const { allSections: sections } = currPage
        for (let i = 0; i < sections.length; i++) {
            const { id } = sections[i]
            if (!pageRefMap.sections[id]?.ref) continue
            const sectionRef = pageRefMap.sections[id].ref!
            const { left, right, top, bottom } = sectionRef.getBoundingClientRect()
            if (x > left && x < right &&
                y > top && y < bottom) return sections[i]
        }
        return null
    }
    function endAllActions() {
        setDragMode(null)
        setMouseDragStartPos(null)
        setEditedGrid(null)
        setViewMode(null)
    }

    // LISTENERS
    useEventListener('resize', ev => {
        sectionContainerSizeHandler()
    })
    useEventListener('mousemove', mouseMoveHandler)
    useEventListener('mousedown', mouseDownHandler)
    useEventListener('mouseup', mouseUpHandler)
    useEventListener('keydown', keydownHandler)

    useEffect(() => {
        wapEditPreviewRefHandler(wapEditPreviewRef.current)
    }, [currBreakpoint, currScreenWidth, currPage.allSectionIds.length, dragMode])

    return (
        <Container
            className={`global-container page-editor-container flex-grow-1 white-100 flex column items-center ma-0 
            ${(dragMode === 'grid-resize-cols' || dragMode === 'grid-canvas-edit-cols') && 'cursor-col-resize'}
            ${(dragMode === 'grid-resize-rows' || dragMode === 'grid-canvas-edit-rows') && 'cursor-row-resize'}`}
            onClick={clickHandler}
            sx={{
                padding: `${marginBlock}px ${marginInline}px !important`,
                height: `calc(100dvh - ${appBarHeight + wapEditToolbarHeight}px)`,
            }}>
            <PageUnderlay
                currBreakpoint={currBreakpoint}
                deadSpaceInline={2 * marginInline}
                deadSpaceTop={2 * marginBlock + wapEditToolbarHeight + appBarHeight}
            />
            <Box
                className="buffer-container w-100 h-100 xs-shadow flex column"
                onScroll={scrollHandler}
                sx={{
                    maxWidth: currScreenWidth
                        ? currScreenWidth + 'px'
                        : '100%',
                }}>
                <Box
                    className="page-link-container relative z-5 pa-0 ma-0 flex column justify-center items-center sticky blackish"
                    sx={{
                        height: pageLinkHeight + 'px',
                    }}>
                    <Typography className="page-link fs-080-rem fw-200 black-200">
                        {`https://url/${wap.url}`}
                    </Typography>

                </Box>
                <Box
                    className={`page-preview z-4 -0 ma-0 flex column ${selectedEl?.id === currPage.id && 'selected'}`}
                    sx={{
                        width: currScreenWidth
                            ? currScreenWidth + 'px'
                            : '100%',
                        height: `calc(100dvh - ${wapEditToolbarHeight + appBarHeight + 2 * marginBlock + pageLinkHeight}px)`,
                    }}
                >
                    <main
                        onScroll={scrollHandler}
                        className="main-container sections-container wap-edit-preview relative grid"
                        style={{
                            gridTemplateColumns: currPage.cols.join(' '),
                            gridTemplateRows: currPage.rows(currBreakpoint.start).join(' ')
                        }}
                        ref={wapEditPreviewRef}>
                        {getSections()}
                    </main>
                    {wapEditPreviewRef.current && <SectionsPreviewOverlays
                        viewMode={viewMode}
                        selectedEl={selectedEl}
                        currPage={currPage}
                        sectionContainerSize={sectionContainerSize}
                        mouseClient={mouseClient}
                        onAddSection={addSectionHandler}
                    />}

                </Box>
            </Box>
                {wapEditPreviewRef.current && <SectionEditToolsOverlays
                    viewMode={viewMode}
                    onSetViewMode={viewModeHandler}
                    currBreakpoint={currBreakpoint}
                    innerTopDelta={-(appBarHeight + wapEditToolbarHeight + 2)}
                    selectedEl={selectedEl}
                    onSelectGridIdx={selectGridIdxHandler}
                    pageRefMap={pageRefMap}
                    currPage={currPage}
                    containerSize={globalContainerSize}
                    onSetGridLayout={sectionGridLayoutHandler}
                    relativeMousePos={lastMouseClickPos}
                    editedGrid={editedGrid}
                    dragMode={dragMode}
                />}

        </Container>
    )
}