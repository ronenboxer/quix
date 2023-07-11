import { HtmlTags, SectionType, WapElement, WapSection } from "@/model/wap"
import { Box, IconButton } from "@mui/material"
import { blue } from "@mui/material/colors"
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone'
import { CSSProperties, useEffect } from "react"
import { BUTTONS_EDGES_DELTA } from "@/model/DOM/units"


interface AddSectionButtonsProps {
    section: WapSection<SectionType>
    sectionRef: HTMLElement
    hoveredEl: WapElement<HtmlTags> | null | null
    selectedEl: WapElement<HtmlTags> | null | null
    sectionContainerSize: { x: number, y: number, width: number, height: number }
    mouseClient: { x: number, y: number }
    col: number
    row: number
    cols: number
    rows: number
    onAddSection: (idx: number, sectionType: SectionType, isVertical: boolean, isGlobal?: boolean) => void
}

export default function AddSectionButtons(props: AddSectionButtonsProps) {
    const { section, sectionRef, selectedEl, hoveredEl, mouseClient, sectionContainerSize, col, row, cols, rows, onAddSection } = props
    const { x, y, width: w, height: h } = sectionRef.getBoundingClientRect()
    const { x: contX, y: contY, width: contW, height: contH } = sectionContainerSize

    function addSectionHandler(ev: React.MouseEvent, idx: number, sectionType: SectionType, isVertical: boolean, isGlobal: boolean = false) {
        ev.stopPropagation()
        onAddSection(idx, sectionType, isVertical, isGlobal)
    }

    function isButtonShown(isFirst: boolean) {
        if (hoveredEl?.id !== section.id && selectedEl?.id !== section.id) return false
        if (section.isVertical) {
            if (isFirst) {
                if (col === 0 ||
                    Math.abs(x - mouseClient.x) > BUTTONS_EDGES_DELTA &&
                    selectedEl?.id !== section.id) return false
                return (contX <= x)
            } else {
                if (col === cols - 1 ||
                    Math.abs(x + w - mouseClient.x) > BUTTONS_EDGES_DELTA &&
                    selectedEl?.id !== section.id) return false
                return (x + w <= contX + contW)
            }
        } else {
            if (isFirst) {
                if (row === 0 ||
                    (Math.abs(y - mouseClient.y) > BUTTONS_EDGES_DELTA &&
                        selectedEl?.id !== section.id)) return false
                return (contY <= y)
            } else {
                if (row === rows - 1 ||
                    Math.abs(y + h - mouseClient.y) > BUTTONS_EDGES_DELTA &&
                    selectedEl?.id !== section.id) return false
                return (y + h <= contY + contH)
            }
        }
    }


    function getButtonStyle(isFirst: boolean): CSSProperties {
        const styles: CSSProperties = {
            backgroundColor: blue['A400'],
        }
        if (section.isVertical) {
            if (h <= contH) {
                if (y + h / 2 <= contY ||
                    y + h / 2 >= contY + contH) return { ...styles, display: 'none' }
                if (y < contY) styles.top = y + h / 2 - contY + 'px'
                else styles.top = h / 2 + 'px'

            } else if (y <= contY) {
                if (y + h >= contY + contH) styles.top = contH / 2 + contY - y + 'px'
                else styles.top = `calc(100% - ${contH / 2}px)`
                if (y + h <= contY + contH / 2) return { ...styles, display: 'none' }
            } else {
                if (y + h <= contY + contH) styles.top = '50%'
                else styles.top = contH / 2 + 'px'
                if (y + contH / 2 >= contY + contH) return { ...styles, display: 'none' }
            }
            if (isFirst) {
                styles.left = '-1px'
                styles.transform = 'translate(-50%, -50%)'
            } else {
                styles.right = '-1px'
                styles.transform = 'translate(50%, -50%)'
            }
        } else {
            if (w <= contW) {
                if (x + w / 2 <= contX ||
                    x + w / 2 >= contX + contW) return { ...styles, display: 'none' }
                if (x < contX) styles.left = x + w / 2 - contX + 'px'
                else styles.left = w / 2 + 'px'
            } else if (x <= contX) {
                if (x + w >= contX + contW) styles.left = contW / 2 + contX - x + 'px'
                else styles.left = `calc(100% - ${contW / 2}px)`
                if (x + w <= contX + contW / 2) return { ...styles, display: 'none' }
            } else {
                if (x + w <= contX + contW) styles.left = '50%'
                else styles.left = contW / 2 + 'px'
                if (x + contW / 2 >= contX + contW) return { ...styles, display: 'none' }
            }
            if (isFirst) {
                styles.top = '-2px'
                styles.transform = 'translate(-50%, -50%)'
            } else {
                styles.bottom = '0px'
                styles.transform = 'translate(-50%, 50%)'
            }
        }
        return styles
    }

    useEffect(() => {
        // console.log('Add Section Buttons of Section Id:', section.id)

    }, [])

    return (
        <Box
            className="section-preview-add-section-button-container events-none w-100 h-100 relative z-40 grid-full"

        >
            {isButtonShown(true) && <IconButton
                className="add-section-button first-add-button absolute z-40 white-50 events-all"
                sx={getButtonStyle(true)}
                onClick={(ev) => addSectionHandler(
                    ev,
                    section.isVertical
                        ? col
                        : row,
                    'section',
                    section.isVertical,
                    false
                )}
            >
                <AddTwoToneIcon sx={{ fontSize: 'medium' }} />
            </IconButton>}
            {isButtonShown(false) && <IconButton
                className="add-section-button second-add-button  absolute z-40 white-50 events-all"
                sx={getButtonStyle(false)}
                onClick={(ev) => addSectionHandler(
                    ev,
                    section.isVertical
                        ? col + 1
                        : row + 1,
                    'section',
                    section.isVertical,
                    false
                )}
            >
                <AddTwoToneIcon sx={{ fontSize: 'medium' }} />
            </IconButton>}
        </Box>
    )

}