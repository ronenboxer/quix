import { useSvg } from "@/components/shared/useSvg"
import SideDrawer from "@/components/ui/sideDrawer"
import { HtmlTags, PageType, SectionType, WapContainerEl, WapPage, WapSection } from "@/model/wap"
import { WapElement } from "@/model/wap"
import { Box, IconButton } from "@mui/material"
import InspectorDrawer from "./miscTools/inspectorDrawer"
import NotificationMenu from "./notificationMenu"

interface MiscToolsProps {
    selectedEl: WapPage<PageType> | WapSection<SectionType> | WapContainerEl | WapElement<HtmlTags> | null
    onSetSelectedEl: (el: WapElement<HtmlTags> | WapPage<PageType> | null) => void
    currDrawer: 'comments' | 'inspector' | null
    onSetDrawer: (drawer: 'comments' | 'inspector' | null) => void
    breadcrumbs: (WapPage<PageType> |WapContainerEl | WapSection<SectionType> | WapElement<HtmlTags>)[]
}

export default function MiscTools(props: MiscToolsProps) {
    const { currDrawer, onSetDrawer, selectedEl, breadcrumbs, onSetSelectedEl } = props

    function toggleDrawerHandler(drawer: 'comments' | 'inspector' | null) { onSetDrawer(drawer) }
    function selectedElHandler(el: WapElement<HtmlTags> | WapPage<PageType> | null) { onSetSelectedEl(el) }

    return (
        <Box className="misc-tools flex items-center gap-8">
            <Box className="splitter flex items-center h-100 ">
                <NotificationMenu />
                <IconButton onClick={() => toggleDrawerHandler('comments')}>{useSvg('comments')}</IconButton>

            </Box>
            <IconButton onClick={() => toggleDrawerHandler('inspector')}>{useSvg('inspector')}</IconButton>

            <InspectorDrawer
                selectedEl={selectedEl}
                breadcrumbs={breadcrumbs}
                isOpen={currDrawer === 'inspector'}
                onToggleDrawer={toggleDrawerHandler}
                onSetSelectedEl={selectedElHandler}
            />
        </Box>
    )
}