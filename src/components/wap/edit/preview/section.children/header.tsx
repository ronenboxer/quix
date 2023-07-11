import { useSvg } from "@/components/shared/useSvg"
import { HtmlTags, SectionType, WapElement, WapSection } from "@/model/wap"
import { Icon, Typography } from "@mui/material"
import { blue, lightGreen } from "@mui/material/colors"

interface HeaderProps {
    section: WapSection<SectionType>
}

export default function SectionHeader(props: HeaderProps) {
    const { section } = props

    return (
        <Typography
            className={`section-header capitalize flex items-center absolute fs-08 fw-200 ${section.isGlobal && 'global'}`}
            sx={{
                color: section.isGlobal
                    ? lightGreen['A700']
                    : blue['A700'],
                fill: section.isGlobal
                    ? lightGreen['A700']
                    : blue['A700'],
            }}
        >
            {section.isGlobal && <Icon
                className="global-icon scale-70">
                {useSvg('header_globals')}
            </Icon>}
            {section.type}
        </Typography>
    )
}