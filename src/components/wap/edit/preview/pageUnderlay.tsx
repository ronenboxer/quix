import { SVG, useSvg } from "@/components/shared/useSvg"
import { PageBreakpoint } from "@/model/wap"
import { Box, Icon, Typography } from "@mui/material"
import { useEffect, useRef, useState } from "react"

interface PageUnderlayProps {
    currBreakpoint: PageBreakpoint
    deadSpaceTop:number
    deadSpaceInline:number
}

export default function PageUnderlay(props: PageUnderlayProps) {
    const { currBreakpoint,deadSpaceInline,deadSpaceTop } = props
    const [indicatorWidth, setIndicatorWidth] = useState(0)
    const indicatorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const indicatorEl = indicatorRef.current
        if (indicatorEl) {
            const width = indicatorEl.offsetWidth
            const height = indicatorEl.offsetHeight
            indicatorEl.style.top = width / 2 + 'px'
            indicatorEl.style.left = -width / 2 - height / 2 + 'px'
            setIndicatorWidth(height)
        }
    }, [currBreakpoint])

    return (
        <Box
            className="page-preview-underlay absolute grid fg-1 z-1 pa-0 mb-0 grey-200 background"
            sx={{
                width: currBreakpoint.end
                    ? currBreakpoint.end + 'px'
                    : '100%',
                maxWidth: `calc(100dvw - ${deadSpaceInline}px) !important`,
                height: `calc(100dvh - ${deadSpaceTop}px)`,
                gridTemplateColumns: indicatorWidth + ` 1fr`,
            }}
        >

            <div className="width-indicator absolute flex center fill black-200 rotate-75" ref={indicatorRef}>
                <Icon className="scale-75">{useSvg('header_' + currBreakpoint.screenType as SVG)}</Icon>
                <Typography className="fw-400 capitalize black-200 mx-4">
                    {currBreakpoint.screenType}
                </Typography>
                <Typography className="fw-200 black-200 w-max">
                    {currBreakpoint.end
                        ? '(' + currBreakpoint.text + ')'
                        : '(Primary)'
                    }
                </Typography>
            </div>
        </Box>
    )
}