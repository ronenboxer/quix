import { useSvg } from "@/components/shared/useSvg"
import { Box } from "@mui/material"

interface SizePanelProps {
    currTab: number
    idx: number
}
export default function SizePanel(props: SizePanelProps) {
    const { currTab, idx } = props

    return (
        <div
            role="tabpanel"
            hidden={currTab !== idx}
            id="size-control-tabpanel"
        >
            {currTab === idx && <Box>
                Shit
            </Box>}

        </div>
    )
}