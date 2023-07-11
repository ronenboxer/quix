import { HtmlTags, PageType, SectionType, WapElement, WapPage, WapSection } from "@/model/wap"
import { Box, IconButton } from "@mui/material";
import SingleSectionPreviewOverlay from "./section/singleSectionPreviewOverlay"
import { DOMGridLayout, DragMode, Orientation, PageRefMap, RefMap, ViewMode } from "@/model/DOM"
import { CSSProperties, useEffect } from "react"
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone'
import { blue } from "@mui/material/colors";
import { BUTTONS_EDGES_DELTA } from "@/model/DOM/units";

interface SectionsPreviewOverlaysProps {
    viewMode: null | ViewMode
    selectedEl: WapElement<HtmlTags>| WapPage<PageType> | null
    sectionContainerSize: { x: number, y: number, width: number, height: number }
    mouseClient: { x: number, y: number }
    currPage: WapPage<PageType>
    onAddSection: (idx: number, sectionType: SectionType, isVertical: boolean, isGlobal: boolean) => void
}


export default function SectionsPreviewOverlays(props: SectionsPreviewOverlaysProps) {
    const { viewMode, selectedEl, sectionContainerSize, mouseClient, currPage, onAddSection } = props
    const cols = currPage.sectionsIds.length
    const mainColSectionIds = currPage.mainColSectionIds
    const rows = mainColSectionIds.length
    const firstSection = currPage.mainColSections[0]
    const lastSection = currPage.mainColSections[rows - 1]
    const { x: contX, y: contY, height: contH, width: contW } = sectionContainerSize
    const firstCol = currPage.sectionsIds[0]
    const lastCol = currPage.sectionsIds[cols - 1]

    function addSectionHandler(idx: number, sectionType: SectionType, isVertical: boolean, isGlobal: boolean = false) {
        if (viewMode === 'grid-canvas-edit') return
        onAddSection(idx, sectionType, isVertical, isGlobal)
    }

    function getAddSectionBtnStyle(isFirst: boolean, isVertical: boolean): CSSProperties {
        const styles: CSSProperties = {
            backgroundColor: blue['A400'],
            top: contY + contH / 2 + 'px',
            left: contX + contW / 2 + 'px'
        }

        if (isVertical) {
            if (isFirst) {
                if ((Math.abs(mouseClient.y - contY) > BUTTONS_EDGES_DELTA &&
                    selectedEl?.id !== firstSection.id) ||
                    firstSection.type === 'header') return { ...styles, display: 'none' }
                styles.top = contY + 'px'
            } else {
                if ((Math.abs(contY + contH - mouseClient.y) > BUTTONS_EDGES_DELTA &&
                    selectedEl?.id !== lastSection.id) ||
                    lastSection.type === 'footer') return { ...styles, display: 'none' }
                styles.top = contY + contH + 'px'
            }
        }
        else {
            if (isFirst) {
                if (Math.abs(mouseClient.x - contX) > BUTTONS_EDGES_DELTA &&
                    ((firstCol.isVertical &&
                        selectedEl?.id !== firstCol.ids[0]) ||
                        !firstCol.isVertical)) return { ...styles, display: 'none' }
                styles.left = contX + 'px'
            } else {
                if (Math.abs(contX + contW - mouseClient.x) > BUTTONS_EDGES_DELTA &&
                    ((lastCol.isVertical &&
                        selectedEl?.id !== lastCol.ids[0]) ||
                        !lastCol.isVertical)) return { ...styles, display: 'none' }
                styles.left = contX + contW + 'px'
            }
        }
        return styles
    }

    useEffect(() => {
        // console.log('SectionPreviewOverlays - many')
    }, [])
    return (
        <Box className="overlay sections-overlay absolute block z-10">
            {viewMode !== 'grid-canvas-edit' &&
                <>
                    <IconButton
                        className="edges-add-section-button absolute white-50 events-all z-11 translate-center"
                        sx={getAddSectionBtnStyle(true, false)}
                        onClick={() => addSectionHandler(0, 'section', true, false)}
                    >
                        <AddTwoToneIcon sx={{ fontSize: 'medium' }} />
                    </IconButton>
                    <IconButton
                        className="edges-add-section-button absolute white-50 events-all z-11 translate-center"
                        sx={getAddSectionBtnStyle(false, false)}
                        onClick={() => addSectionHandler(cols, 'section', true, false)}
                    >
                        <AddTwoToneIcon sx={{ fontSize: 'medium' }} />
                    </IconButton>
                    <IconButton
                        className="edges-add-section-button absolute white-50 events-all z-11 translate-center"
                        sx={getAddSectionBtnStyle(true, true)}
                        onClick={() => addSectionHandler(0, 'section', false, false)}
                    >
                        <AddTwoToneIcon sx={{ fontSize: 'medium' }} />
                    </IconButton>
                    <IconButton
                        className="edges-add-section-button absolute white-50 events-all z-11 translate-center"
                        sx={getAddSectionBtnStyle(false, true)}
                        onClick={() => addSectionHandler(cols, 'section', false, false)}
                    >
                        <AddTwoToneIcon sx={{ fontSize: 'medium' }} />
                    </IconButton>
                </>
            }
        </Box >
    )

}