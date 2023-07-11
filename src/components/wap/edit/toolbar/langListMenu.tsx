import DropdownMenu from "@/components/ui/dropdownMenu"
import { FLAG_LANG_MAP, Flag } from "@/model/DOM"
import { Capitalize } from "@/services/util.service"
import { Box, ListItemIcon, ListItemText, MenuItem, Theme } from "@mui/material"
import Image from "next/image"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

interface LangListMenuProps {
    flags: Flag[]
    isLangListMenuOpen: boolean
    onSetIsLangListMenuOpen: (state: boolean) => void
    onSelectLang: (flag: Flag) => void
    currFlag: Flag
    theme: Theme
}

export default function LangListMenu(props: LangListMenuProps) {
    const { flags, isLangListMenuOpen, onSetIsLangListMenuOpen, onSelectLang, currFlag, theme } = props

    const menuButton = <>
        <Image src={`/assets/flags/${currFlag}.png`} alt={FLAG_LANG_MAP[currFlag].key} width={20} height={15} />
        <span>{FLAG_LANG_MAP[currFlag].key.toUpperCase()}</span>
    </>

    function toggleLangMenuHandler(state: boolean) {
        onSetIsLangListMenuOpen(state)
    }

    function selectLangHandler(flag: Flag) {
        onSelectLang(flag)
        toggleLangMenuHandler(false)
    }

    function getLangList() {
        return flags.map(flag =>
            <MenuItem
                className="menu-lang-item gap-12"
                key={flag} onClick={() => selectLangHandler(flag)} sx={{
                    // gap: '12px',
                    ...(flag === currFlag ? {
                        bgcolor: theme.palette.action.selected + ' !important',
                        color: 'text.secondary'
                    } : {})
                }}>
                <ListItemIcon>
                    <Image src={`/assets/flags/${flag}.png`} alt={FLAG_LANG_MAP[flag].key} width={20} height={15} />
                </ListItemIcon>
                <ListItemText>
                    <p>{Capitalize(FLAG_LANG_MAP[flag].value)}</p>
                    <small color={theme.palette.text.primary + '!important'}>{flag === currFlag ? 'Main Language' : 'Visible'}</small>
                </ListItemText>
            </MenuItem>
        )
    }

    return (<Box className="lang-tools flex h-100 items-center">
        <DropdownMenu
            buttonIcon={<KeyboardArrowDownIcon />}
            buttonContent={menuButton}
            isMenuOpen={isLangListMenuOpen}
            onSetIsMenuOpen={toggleLangMenuHandler}
            name="flag-list"
            placement="bottom-start"
        >
            {getLangList()}
        </DropdownMenu>
    </Box>)
}