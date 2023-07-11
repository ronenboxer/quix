import { useSvg } from "@/components/shared/useSvg"
import SideDrawer from "@/components/ui/sideDrawer"
import { WapElement, HtmlTags, SectionType, WapContainerEl, WapPage, WapSection, PageType } from "@/model/wap"
import { Box, Breadcrumbs, IconButton, Stack } from "@mui/material"
import SectionInspector from "./inspector/sectionInspector"
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { makeId } from "@/services/util.service"

interface InspectorDrawerProps<T> {
    isOpen: boolean
    onToggleDrawer: (drawer: 'inspector' | null) => void
    selectedEl: T | null
    onSetSelectedEl: (el: WapElement<HtmlTags> | WapPage<PageType> | null) => void
    breadcrumbs: (WapPage<PageType> | WapContainerEl | WapSection<SectionType> | WapElement<HtmlTags>)[]
}

export default function InspectorDrawer<T extends WapPage<PageType> | WapSection<SectionType> | WapContainerEl | WapElement<HtmlTags>>(props: InspectorDrawerProps<T>) {
    const { isOpen, onToggleDrawer: onToggleInspectorDrawer, selectedEl, onSetSelectedEl, breadcrumbs } = props
    const width = 260

    function toggleDrawerHandler(state: boolean = !isOpen) {
        onToggleInspectorDrawer(!state || isOpen
            ? null
            : 'inspector')
    }
    function selectedElHandler(el: WapElement<HtmlTags> | WapPage<PageType> | null) { onSetSelectedEl(el) }

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
            onToggleDrawer={toggleDrawerHandler}
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
            {selectedEl?.name === 'Section' && <SectionInspector
                selectedSection={selectedEl as WapSection<SectionType>}
            />}
        </SideDrawer>
    )
}