import { useSvg } from "@/components/shared/useSvg"
import SingleAccordion from "@/components/ui/singleAccordion"
import { Box, IconButton } from "@mui/material"
import { useState } from "react"
import Info from '@mui/icons-material/InfoOutlined'
import { blue } from "@mui/material/colors"
import SizeControl from "./sizeControl"
import { GridLayout, HtmlContainerTags, HtmlTags, PageType, SectionType, WapContainerEl, WapElement, WapPage, WapSection } from "@/model/wap"

interface SizePanelProps<T extends WapContainerEl<HtmlContainerTags>|WapPage<PageType>| WapElement<HtmlTags>> {
    currTab: number
    idx: number
    onSetGridLayout: <K extends WapContainerEl<HtmlContainerTags>>(cont: K, grid: GridLayout) => void
    element: T
    bp: number
}
export default function SizePanel<T extends WapContainerEl<HtmlContainerTags>|WapPage<PageType>| WapElement<HtmlTags>>(props: SizePanelProps<T>) {
    const { element, currTab, idx, onSetGridLayout, bp } = props

    const [expandedAccordion, setExpandedAccordion] = useState<null | string>(null)
    const sizeSummary = <Box className="flex-grow-1 flex justify-between items-center" sx={{
        svg: {
            display: 'none',
        },
        '&:hover': {
            svg: {
                display: 'inline-block',
                '&:hover': {
                    color: blue['A700']
                }
            }
        }
    }}>
        <span className="fw-500">Size</span>
        <Info />
    </Box>
    const sizeDetails = element instanceof WapPage
        ? <></>
        : <SizeControl element={element} onSetGridLayout={containerGridLayoutHandler} bp={bp} />

    function toggleAccordionExpandHandler(id: string) { setExpandedAccordion(id === expandedAccordion ? null : id) }
    function containerGridLayoutHandler<K extends WapContainerEl<HtmlContainerTags>>(cont: K, grid: GridLayout) { onSetGridLayout(cont, grid) }

    return (
        <div
            role="tabpanel"
            hidden={currTab !== idx}
            id="size-control-tabpanel"
        >
            {currTab === idx && <div>
                <div className="flex center gap-12 px-8 py-16">
                    <IconButton className="px-0 py-8">{useSvg('alignInlineStart')}</IconButton>
                    <IconButton className="px-0 py-8">{useSvg('alignInlineCenter')}</IconButton>
                    <IconButton className="px-0 py-8">{useSvg('alignInlineEnd')}</IconButton>
                    <IconButton className="px-0 py-8">{useSvg('alignBlockTop')}</IconButton>
                    <IconButton className="px-0 py-8">{useSvg('alignBlockCenter')}</IconButton>
                    <IconButton className="px-0 py-8">{useSvg('alignBlockBottom')}</IconButton>
                    <IconButton className="px-0 py-8">{useSvg('distributeInline')}</IconButton>
                    <IconButton className="px-0 py-8">{useSvg('distributeBlock')}</IconButton>
                </div>
            </div>}
            <div className="size-options-accordion">
                <SingleAccordion
                    id="size"
                    isExpanded={expandedAccordion === 'size'}
                    onToggleExpand={toggleAccordionExpandHandler}
                    accordionStyle={{
                        border: 'none'
                    }}
                    summary={sizeSummary}
                    details={sizeDetails}
                    summaryProps={{
                        className: 'white-200-background black-200',
                    }}
                />
            </div>

        </div>
    )
}