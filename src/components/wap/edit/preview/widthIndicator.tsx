import { SVG, useSvg } from "@/components/shared/useSvg"
import { PageBreakpoint } from "@/model/wap"
import { Icon, Typography } from "@mui/material"
import { useEffect, useRef } from "react"

interface WidthIndicatorProps {
    currBreakpoint: PageBreakpoint
}

export default function WidthIndicator(props: WidthIndicatorProps) {
    const { currBreakpoint } = props
    const indicatorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const indicatorEl = indicatorRef.current
        if (indicatorEl) {
            const width = indicatorEl.offsetWidth
            const height = indicatorEl.offsetHeight
            indicatorEl.style.top = width / 2 + 'px'
            indicatorEl.style.left = -width / 2 - height / 2 + 'px'
        }
    }, [currBreakpoint])

    return (
        <div className="width-indicator absolute flex center" ref={indicatorRef}>

            <Icon sx={{
                transform: `scale(${18 / 24})`,
                fill: '#666'
            }}>{useSvg('header_' + currBreakpoint.screenType as SVG)}</Icon>
            <Typography sx={{
                textTransform: 'capitalize',
                fontWeight: 400,
                fontSize: 'inherit',
                color: '#666',
                marginInline: '4px',
            }}>
                {currBreakpoint.screenType}
            </Typography>
            <Typography sx={{
                fontWeight: 200,
                fontSize: 'inherit',
                color: '#666',
                width: 'max-content'
            }}>
                {currBreakpoint.end
                    ? '(' + currBreakpoint.text + ')'
                    : '(Primary)'
                }
            </Typography>
        </div>
    )
}