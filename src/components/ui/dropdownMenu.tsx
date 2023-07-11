import { CSSProperties, ReactNode, RefObject, useRef } from "react"
import { Box, Button, Popper, Grow, Paper, MenuList, ClickAwayListener, Divider, Tooltip } from "@mui/material"

interface DropdownMenuProps {
    children: ReactNode
    isMenuOpen: boolean
    buttonContent: JSX.Element
    buttonIcon?: JSX.Element
    onSetIsMenuOpen: (state: boolean) => void
    name: string
    header?: ReactNode
    footer?: ReactNode
    placement: "top" | "bottom" | "left" | "right" | "top-start" | "top-end" | "bottom-start" | "bottom-end" | "right-start" | "right-end" | "left-start" | "left-end" | "auto" | "auto-start" | "auto-end"
    extraStyle?: CSSProperties
    buttonToolTip?: string | ReactNode
    extraClasses?: string
}

export default function DropdownMenu(props: DropdownMenuProps) {

    const { placement, name, children, isMenuOpen,
        buttonContent, onSetIsMenuOpen, buttonIcon = null,
        header = null, footer = null, extraStyle = {}, buttonToolTip = '', extraClasses = '' } = props
    const anchorRef = useRef<HTMLButtonElement>(null)
    function toggleMenuHandler() {
        onSetIsMenuOpen(!isMenuOpen)
    }

    function closeMenuHandler(event: Event | React.SyntheticEvent) {
        const target = ((event as Event).target as HTMLElement)
        if (
            (target &&
                (target.classList.contains('actions')) ||
                target.classList.contains('action-button') ||
                target.querySelector('action-button') ||
                target.closest('.actions')
            ) || (anchorRef.current &&
                anchorRef.current.contains(event.target as HTMLElement))
        ) {
            return
        }
        onSetIsMenuOpen(false)
    }

    function handleListKeyDown(event: React.KeyboardEvent) {
        if (event.key === 'Tab') {
            event.preventDefault()
            onSetIsMenuOpen(false)
        } else if (event.key === 'Escape') {
            onSetIsMenuOpen(false)
        }
    }
    return <Box className={`global-dropdown-menu flex items-center h-100 w-fit ${extraClasses}`}>
        <Tooltip disableFocusListener disableTouchListener title={buttonToolTip}>
            <Button
                id={`${name}-menu-button`}
                aria-controls={isMenuOpen ? `${name}-menu` : undefined}
                aria-haspopup="true"
                aria-expanded={isMenuOpen ? 'true' : undefined}
                onClick={toggleMenuHandler}
                ref={anchorRef}
                endIcon={buttonIcon}
            >
                {buttonContent}
            </Button>
        </Tooltip>
        <Popper
            open={isMenuOpen}
            anchorEl={anchorRef.current}
            role={undefined}
            placement={placement}
            transition
            disablePortal
        >
            {({ TransitionProps, placement }) => (
                <Grow
                    {...TransitionProps}
                    style={{
                        transformOrigin:
                            placement === 'bottom-start' ? 'left top' : 'left bottom',
                    }}
                >
                    <Paper elevation={8}>
                        <ClickAwayListener onClickAway={closeMenuHandler}>
                            <Box>
                                {header && <>
                                    {header}
                                    <Divider />
                                </>}
                                <MenuList
                                    autoFocusItem={isMenuOpen}
                                    id={`${name}-composition-menu`}
                                    aria-labelledby={`${name}-composition-button`}
                                    onKeyDown={handleListKeyDown}
                                    sx={extraStyle}
                                >
                                    {children}
                                </MenuList>
                                {footer && <>
                                    <Divider />
                                    {footer}
                                </>}
                            </Box>
                        </ClickAwayListener>
                    </Paper>
                </Grow>
            )}
        </Popper>
    </Box>
}