import { PageType, WapPage } from "@/model/wap"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import DropdownMenu from "@/components/ui/dropdownMenu"
import { Box, Divider, ListItemText, MenuItem, Theme } from "@mui/material"
import { Fragment, useState } from "react"
import VerticalDivider from "@/components/shared/verticalDivider"

interface PageListProps {
    pages: Partial<{ [T in PageType]: WapPage<T>[] }>
    isPageListMenuOpen: boolean
    onSetIsPageListMenuOpen: (value: boolean) => void
    onSelectPage: (id: string) => void
    theme: Theme,
    currPageId: string
}

export default function wPageListMenu(props: PageListProps) {
    const { pages, isPageListMenuOpen, onSetIsPageListMenuOpen, theme, currPageId, onSelectPage } = props
    const [pageList, setPageList] = useState(getPageList())

    function togglePageListMenuHandler(state: boolean) {
        onSetIsPageListMenuOpen(state)
    }

    function getPage(pageId: string) {
        for (let pageType in pages) {
            const page = (pages[pageType as keyof typeof pages] as WapPage<PageType>[])?.find((p: WapPage<any>) => p.id === pageId) || null
            if (page) return page
        }
        return null
    }

    function selectPageHandler(id: string) {
        onSelectPage(id)
        togglePageListMenuHandler(false)
    }


    function getPageList() {
        return Object.keys(pages).map((pageType, idx, typesArr) => {
            if (!pages[pageType as keyof typeof pages]) return null
            return [<MenuItem key={pageType} disabled sx={{
                color: 'text.primary'
            }}>
                <ListItemText>
                    <h4>{pageType}</h4>
                </ListItemText>
            </MenuItem>,
            pages[pageType as keyof typeof pages]!.map(page => {
                return <MenuItem
                    key={page.id}
                    onClick={() => selectPageHandler(page.id)}
                    selected={page.id === currPageId}>
                    <ListItemText>
                        {page.title}
                    </ListItemText>
                </MenuItem>
            }), idx !== typesArr.length - 1
                ? <Divider />
                : null
            ]
        })
    }

    return (
        (<Box className="page-list-select-tool flex h-100 items-center">

            <DropdownMenu
                name='page-list'
                onSetIsMenuOpen={togglePageListMenuHandler}
                isMenuOpen={isPageListMenuOpen}
                buttonIcon={<KeyboardArrowDownIcon />}
                buttonContent={<p>{getPage(currPageId)?.title || 'Pages'}</p>}
                placement="bottom-start"
                extraStyle={{
                    flexGrow: 1
                }}
            >
                {getPageList()}
            </DropdownMenu>
            <VerticalDivider height={50} colorClassName="white-200" styles={{
                marginInline: '8px'
            }}/>
        </Box>)
    )

}