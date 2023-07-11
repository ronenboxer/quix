import { useSvg } from "@/components/shared/useSvg"
import { Box, MenuList, MenuItem, ListItemText, Typography, IconButton } from "@mui/material"
import { blue } from "@mui/material/colors"

interface DoubleMenuProps {
    innerMenuWidth: number,
    outerMenuWidth: number
    menuList: {
        title: string,
        cmp: JSX.Element,
        isHeader?: true,
        isDivide?: true
    }[],
    extraClasses?: string
    currInnerMenuIdx: number
    onSetCurrInnerMenuIdx: (idx: number) => void
    title: string
    onCloseMenu: () => void
}

export default function DoubleMenu(props: DoubleMenuProps) {
    const { innerMenuWidth, outerMenuWidth, menuList, currInnerMenuIdx, onSetCurrInnerMenuIdx, title, onCloseMenu, extraClasses = '' } = props

    function selectInnerMenuHandler(idx: number) {
        if (currInnerMenuIdx !== idx) onSetCurrInnerMenuIdx(idx)
    }
    function closeMenuHandler() { onCloseMenu() }

    return (
        <Box
            className={`global-double-menu ${extraClasses} flex`}
            sx={{
                width: innerMenuWidth + outerMenuWidth + 'px'
            }}>
            <MenuList
                className="first-list"
                sx={{
                    width: innerMenuWidth + 'px',
                }}>
                {menuList.map((item, idx) => {
                    if (item.isHeader) return <Typography key={item.title}
                        className="first-list-item list-item fs-080-rem fw-700 py-6 px-16 uppercase mt-16">
                        {item.title}
                    </Typography>
                    return <MenuItem key={item.title} sx={{
                        ...(idx === currInnerMenuIdx)
                            ? {
                                color: blue[600],
                                backgroundColor: blue[50] + '!important'
                            }
                            : {}
                    }}>
                        <ListItemText onClick={() => selectInnerMenuHandler(idx)}>
                            <Typography className="fs-080-rem fw-300">
                                {item.title}
                            </Typography>
                        </ListItemText>
                    </MenuItem>
                })}
            </MenuList>
            <Box className="second-list w-100">
                <Box className="second-list-header flex gap-4 items-end py-16 px-24 w-100">
                    <Typography className="fw-700 fs-100-rem flex-grow-1">
                        {title}
                    </Typography>
                    <IconButton className="pa-0">{useSvg('help')}</IconButton>
                    <IconButton
                        onClick={closeMenuHandler}
                        className="pa-0"
                    >{useSvg('close')}</IconButton>
                </Box>
                <Box>
                    {menuList[currInnerMenuIdx].cmp}
                </Box>
            </Box>
        </Box>)
}