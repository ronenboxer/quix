import { useSvg } from "@/components/shared/useSvg"
import { Tab, Tabs } from "@mui/material"
import { useState } from "react"
import SizePanel from "./panels/sizePanel"
import { GridLayout, HtmlContainerTags, HtmlTags, PageType, SectionType, WapContainerEl, WapElement, WapPage, WapSection } from "@/model/wap"

interface SectionInspectorProps {
    selectedSection: WapSection<SectionType> 
    onSetGridLayout: <T extends WapContainerEl<HtmlContainerTags>>(cont: T, grid: GridLayout) => void
    element:  WapSection<SectionType> 
    bp: number
}

export default function SectionInspector(props: SectionInspectorProps) {
    const { element, selectedSection, onSetGridLayout, bp } = props

    const [currTab, setCurrTab] = useState(0)

    function tabHandler(ev: React.SyntheticEvent, tabIdx: number) { setCurrTab(tabIdx) }
    function containerGridLayoutHandler<T extends WapContainerEl<HtmlContainerTags>>(cont: T, grid: GridLayout) { onSetGridLayout(cont, grid) }

    return (
        <section className="inspector section" style={{ width: '260px' }}>
            <Tabs className="panel-control" value={currTab} onChange={tabHandler} aria-label="inspector control tabs">
                <Tab label={useSvg('sizeControl')} id="size-control-tab" aria-controls="size-control-tabpanel" />
                <Tab label={useSvg('colorControl')} id="color-control-tab" aria-controls="color-control-tabpanel" />
                <Tab label={useSvg('interactionsControl')} id="interactions-control-tab" aria-controls="interactions-control-tabpanel" />
            </Tabs>
            <SizePanel currTab={currTab} idx={0}
                bp={bp}
                element={element}
                onSetGridLayout={containerGridLayoutHandler}
            />
        </section>
    )
}