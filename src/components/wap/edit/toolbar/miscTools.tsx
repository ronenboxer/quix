import { useSvg } from "@/components/shared/useSvg"
import SideDrawer from "@/components/ui/sideDrawer"
import { GridLayout, HtmlContainerTags, HtmlTags, PageType, SectionType, WapContainerEl, WapPage, WapSection } from "@/model/wap"
import { WapElement } from "@/model/wap"
import { Box, Button, IconButton } from "@mui/material"
import InspectorDrawer from "./miscTools/inspectorDrawer"
import NotificationMenu from "./notificationMenu"
import VerticalDivider from "@/components/shared/verticalDivider"

interface MiscToolsProps<T extends WapElement<HtmlTags>|WapPage<PageType> | null> {
    selectedEl: T
    onSetSelectedEl:<K extends WapElement<HtmlTags> |WapPage<PageType>> (el: K | null) => void
    currDrawer: 'comments' | 'inspector' | null
    onSetDrawer: (drawer: 'comments' | 'inspector' | null) => void
    breadcrumbs: (WapPage<PageType> | WapContainerEl<HtmlContainerTags> | WapSection<SectionType> | WapElement<HtmlTags>)[]
    bp: number
    onSetGridLayout:<K extends WapContainerEl<HtmlContainerTags>> (cont: K, grid: GridLayout) => void

}

export default function MiscTools<T extends WapElement<HtmlTags>|WapPage<PageType> | null>(props: MiscToolsProps<T>) {
    const { currDrawer, onSetDrawer, selectedEl, breadcrumbs, onSetSelectedEl, onSetGridLayout, bp } = props

    function toggleDrawerHandler(drawer: 'comments' | 'inspector' | null) { onSetDrawer(drawer) }
    function selectedElHandler<K extends WapElement<HtmlTags> | WapPage<PageType>>(el: K | null) { onSetSelectedEl(el) }
    function containerGridLayoutHandler<K extends WapContainerEl<HtmlContainerTags>>(cont: K, grid: GridLayout) { onSetGridLayout(cont, grid) }

    return (
        <Box className="misc-tools flex items-center h-100 gap-8">
            {/* <Box className="splitter flex items-center h-100 ">

            </Box> */}
            <NotificationMenu />
            <Button className={`${currDrawer === 'comments' && 'blue-50-background blue-A400-fill'}`} onClick={() => toggleDrawerHandler('comments')}>{useSvg('comments')}</Button>
            <VerticalDivider height={50} colorClassName="white-200" />
            <Button className={`${currDrawer === 'inspector' && 'blue-50-background blue-A400-fill'}`} onClick={() => toggleDrawerHandler('inspector')}>{useSvg('inspector')}</Button>

            <InspectorDrawer
                bp={bp}
                selectedEl={selectedEl}
                breadcrumbs={breadcrumbs}
                isOpen={currDrawer === 'inspector'}
                onToggleDrawer={toggleDrawerHandler}
                onSetSelectedEl={selectedElHandler}
                onSetGridLayout={containerGridLayoutHandler}
            />
        </Box>
    )
}