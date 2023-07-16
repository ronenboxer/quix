import { useSvg } from "@/components/shared/useSvg"
import DropdownMenu from "@/components/ui/dropdownMenu"
import { Box, Button, IconButton, Typography } from "@mui/material"
import { grey } from "@mui/material/colors"
import { useState } from "react"

interface ZoomMenuProps {
    onSetZoomMultiplier: (zoom?: number) => void
    currZoomMultiplier: number
}

export default function ZoomMenu(props: ZoomMenuProps) {
    const { onSetZoomMultiplier, currZoomMultiplier } = props
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const menuButton = useSvg('headerZoom')

    function zoomMultiplierHandler(zoom: number = 1) {
        if (zoom === currZoomMultiplier) return
        onSetZoomMultiplier(zoom)
    }

    function zoomIn() {
        zoomMultiplierHandler(currZoomMultiplier >= 2
            ? 2
            : currZoomMultiplier + .1)
    }

    function zoomOut() {
        zoomMultiplierHandler(currZoomMultiplier <= .1
            ? .1
            : currZoomMultiplier - .1)
    }

    function toggleZoomMenuHandler(state: boolean) {
        setIsMenuOpen(state)
    }

    function getZoomPercentage() {
        let zoom = currZoomMultiplier
        if (zoom > 2) zoom = 2
        if (zoom < .1) zoom = .1
        return parseInt((zoom * 100).toString()) + '%'
    }

    return (<DropdownMenu
        buttonContent={menuButton}
        isMenuOpen={isMenuOpen}
        onSetIsMenuOpen={toggleZoomMenuHandler}
        name="zoom"
        placement="bottom"
        extraStyle={{ paddingBlock: 0 }}
        buttonToolTip="Zoom"
        extraClasses="zoom-controller"
    >
        <Box className="zoom-options flex items-center gap-4 ppy-0 px-8">
            <Box className="zoom-control flex pe-8 items-center gap-8">
                <IconButton className="zoom-button"
                    disabled={currZoomMultiplier <= .1}
                    onClick={zoomOut}
                    sx={{
                        ...(currZoomMultiplier <= .1)
                            ? { fill: grey[400] }
                            : {}
                    }}
                >
                    {useSvg('headerZoomOut')}
                </IconButton>
                <Typography className="zoom-preview text-center">
                    {getZoomPercentage()}</Typography>
                <IconButton
                    disabled={currZoomMultiplier >= 2}
                    onClick={zoomIn}
                    sx={{
                        ...(currZoomMultiplier >= 2)
                            ? { fill: grey[400] }
                            : {}
                    }}
                >
                    {useSvg('headerZoomIn')}
                </IconButton>
            </Box>
            <Button onClick={() => zoomMultiplierHandler(1)}>
                Reset
            </Button>
        </Box>

    </DropdownMenu>)
}