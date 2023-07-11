
import SideDrawer from "@/components/ui/sideDrawer"
import { EditTool } from "@/model/DOM"
import { Box, MenuList, ListItemText, MenuItem, Divider, Typography } from "@mui/material"
import QuickAdd from "./addElementsList.tsx/quickAdd"
import { CSSProperties, useState } from "react"
import { makeId } from "@/services/util.service"
import AddText from "./addElementsList.tsx/addText"
import { blue } from "@mui/material/colors"
import AddLayoutTools from "./addElementsList.tsx/addLayoutTools"
import AddCompositions from "./addElementsList.tsx/addCompositions"
import AddWireframes from "./addElementsList.tsx/addWireframes"
import AddButtons from "./addElementsList.tsx/addButtons"
import AddNavigation from "./addElementsList.tsx/addMenusAndSearch"
import AddMedia from "./addElementsList.tsx/addMedia"
import AddContact from "./addElementsList.tsx/addContact"
import AddImportedData from "./addElementsList.tsx/addImportedData"
import AddInput from "./addElementsList.tsx/addInput"
import AddBlog from "./addElementsList.tsx/addBlog"
import AddStore from "./addElementsList.tsx/addStore"
import AddMembers from "./addElementsList.tsx/addMembers"

interface AddElementsDrawerProps {
    isOpen: boolean
    onSelectToolDrawer: (tool: EditTool | null) => void
}

export default function AddElementsDrawer(props: AddElementsDrawerProps) {
    const { isOpen, onSelectToolDrawer } = props
    const [currInnerMenuIdx, setCurrInnerMenuItemIdx] = useState(0)
    const menuListWidth = 160

    const menuList: {
        title: string,
        cmp: JSX.Element,
        width: number
        style?: CSSProperties
    }[] = [
            {
                title: 'Quick Add',
                cmp: <QuickAdd onCloseMenu={closeMenuHandler}/>,
                width: 352
            },
            {
                title: 'divider',
                cmp: <Divider key={makeId()} />,
                width: 0
            },
            {
                title: 'Compositions',
                cmp: <AddCompositions onCloseMenu={closeMenuHandler} />,
                width: 532
            },
            {
                title: 'Wireframes',
                cmp: <AddWireframes onCloseMenu={closeMenuHandler} />,
                width: 498
            },
            {
                title: 'Layout tools',
                cmp: <AddLayoutTools onCloseMenu={closeMenuHandler} />,
                width: 498
            },
            {
                title: 'Text',
                cmp: <AddText onCloseMenu={closeMenuHandler} />,
                width: 498
            },
            {
                title: 'Buttons',
                cmp: <AddButtons onCloseMenu={closeMenuHandler} />,
                width: 498
            },
            {
                title: 'Menus & search',
                cmp: <AddNavigation onCloseMenu={closeMenuHandler} />,
                width: 518
            },
            {
                title: 'Media',
                cmp: <AddMedia onCloseMenu={closeMenuHandler} />,
                width: 498
            },
            {
                title: 'Contact & Form',
                cmp: <AddContact onCloseMenu={closeMenuHandler} />,
                width: 498
            },
            {
                title: 'Embed & Social',
                cmp: <AddImportedData onCloseMenu={closeMenuHandler} />,
                width: 498
            },
            {
                title: 'divider',
                cmp: <Divider key={makeId()} />,
                width: 0
            },
            {
                title: 'Input',
                cmp: <AddInput onCloseMenu={closeMenuHandler} />,
                width: 498
            },
            {
                title: 'Blog',
                cmp: <AddBlog onCloseMenu={closeMenuHandler} />,
                width: 498
            },
            {
                title: 'Store',
                cmp: <AddStore onCloseMenu={closeMenuHandler} />,
                width: 498
            },
            {
                title: 'Members',
                cmp: <AddMembers onCloseMenu={closeMenuHandler} />,
                width: 498
            },
        ]

    function toggleDrawerHandler(state: boolean = false) {
        if (!state || isOpen) onSelectToolDrawer(null)
        else (onSelectToolDrawer('addElements'))
    }
    function closeMenuHandler(){ toggleDrawerHandler(false)}
    function selectInnerMenuHandler(idx: number) {
        if (idx !== currInnerMenuIdx) setCurrInnerMenuItemIdx(idx)
    }

    return (
        <SideDrawer
            isOpen={isOpen}
            onToggleDrawer={toggleDrawerHandler}
            width={menuListWidth + menuList[currInnerMenuIdx].width + 'px'}
            extraClasses="add-elements-drawer"

            extraStyle={{
                maxHeight: 'calc(100dvh - 120px)',
                marginTop: '120px'
            }}
        >
            <Box 
                className="flex items-start h-100"
            sx={{
                width: menuListWidth + menuList[currInnerMenuIdx].width + 'px',
            }}>
                <MenuList 
                    className="drawer-list h-100 overflow-auto"
                sx={{
                    width: menuListWidth + 'px',
                }}>
                    {menuList.map((item, idx) => {
                        if (item.title === 'divider') return item.cmp
                        return <MenuItem key={item.title} sx={{
                            ...(idx === currInnerMenuIdx)
                                ? {
                                    color: blue[600],
                                    backgroundColor: blue[50] + '!important'
                                }
                                : {},
                        }} >
                            <ListItemText onClick={() => selectInnerMenuHandler(idx)}>
                                <Typography 
                                    className="fs-080-rem fw-300">
                                    {item.title}
                                </Typography>
                            </ListItemText>
                        </MenuItem>
                    })}
                </MenuList>
                {menuList[currInnerMenuIdx].cmp}
            </Box>

        </SideDrawer>
    )
}