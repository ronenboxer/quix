import { useSvg } from "@/components/shared/useSvg"
import { Tab, Tabs } from "@mui/material"
import { useState } from "react"
import SizePanel from "./panels/sizePanel"
import { SectionType, WapSection } from "@/model/wap"

interface SectionInspectorProps {
    selectedSection: WapSection<SectionType> | null
}

export default function SectionInspector(props: SectionInspectorProps) {
    const {selectedSection } = props

    const [currTab, setCurrTab] = useState(0)

    function tabHandler(ev: React.SyntheticEvent, tabIdx: number) { setCurrTab(tabIdx) }

    return (
        <section>
            <Tabs value={currTab} onChange={tabHandler} aria-label="inspector control tabs">
                <Tab label={useSvg('size_control')} id="size-control-tab" aria-controls="size-control-tabpanel" />
                <Tab label={useSvg('color_control')} id="color-control-tab" aria-controls="color-control-tabpanel" />
                <Tab label={useSvg('interactions_control')} id="interactions-control-tab" aria-controls="interactions-control-tabpanel" />
            </Tabs>
            <SizePanel currTab={currTab} idx={0} />
        </section>
    )
}