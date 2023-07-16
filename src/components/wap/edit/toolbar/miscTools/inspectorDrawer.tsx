import { useSvg } from "@/components/shared/useSvg"
import SideDrawer from "@/components/ui/sideDrawer"
import { WapElement, HtmlTags, SectionType, WapContainerEl, WapPage, WapSection, PageType, GridLayout, HtmlContainerTags } from "@/model/wap"
import { Box, Breadcrumbs, IconButton, Stack } from "@mui/material"
import SectionInspector from "./inspector/sectionInspector"
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { makeId } from "@/services/util.service"

interface InspectorDrawerProps<T extends WapElement<HtmlTags> | WapPage<PageType>> {
    isOpen: boolean
    onToggleDrawer: (drawer: 'inspector' | null) => void
    selectedEl: T | null
    onSetSelectedEl: (el: WapElement<HtmlTags> | WapPage<PageType> | null) => void
    onSetGridLayout: <K extends WapContainerEl<HtmlContainerTags>>(cont: K, grid: GridLayout) => void
    breadcrumbs: (WapPage<PageType> | WapContainerEl<HtmlContainerTags> | WapSection<SectionType> | WapElement<HtmlTags>)[]
    bp: number
}

export default function InspectorDrawer<T extends WapElement<HtmlTags> | WapPage<PageType>>(props: InspectorDrawerProps<T>) {
    const { isOpen, onToggleDrawer: onToggleInspectorDrawer, selectedEl, onSetSelectedEl, onSetGridLayout, breadcrumbs, bp } = props
    const width = 260

    function selectedElHandler(el: WapElement<HtmlTags> | WapPage<PageType> | null) { onSetSelectedEl(el) }
    function containerGridLayoutHandler<K extends WapContainerEl<HtmlContainerTags>>(cont: K, grid: GridLayout) { onSetGridLayout(cont, grid) }

    function getBreadcrumbs() {
        return breadcrumbs.map(el => <span
            className="breadcrumbs pointer"
            key={makeId()}
            onClick={() => selectedElHandler(el)}
        >{el.name}</span>)
    }

    return (
        <SideDrawer
            isOpen={isOpen}
            onToggleDrawer={(_: boolean) => { }}
            width={width + 'px'}
            anchor="right"
            extraStyle={{
                maxHeight: 'calc(100dvh - 120px)',
                marginTop: '120px'
            }}
            extraClasses="inspector-drawer"
        >
            <Box className="px-16 py-10">
                <Stack spacing={2}>
                    <Breadcrumbs
                        className="black-200 fs-10-px"
                        separator={<NavigateNextIcon fontSize="inherit" />}
                        aria-label="breadcrumb"
                    >
                        {getBreadcrumbs()}
                    </Breadcrumbs>
                </Stack>
            </Box>
            {selectedEl?.name?.includes('Section') && <SectionInspector
                element={selectedEl as WapSection<SectionType>}
                bp={bp}
                onSetGridLayout={containerGridLayoutHandler}
                selectedSection={selectedEl as WapSection<SectionType>}
            />}
        </SideDrawer>
    )
}