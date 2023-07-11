import { Drawer, SxProps, Theme } from "@mui/material"
import React, { ReactNode, useEffect, useRef } from "react"
import { Anchor } from "@/model/DOM"
import useOnClickOutside from "@/hooks/useClickOutside"

interface SideDrawerProps {
    anchor?: Anchor
    isOpen: boolean
    children?: ReactNode | JSX.Element
    onToggleDrawer: (newState: boolean) => void
    sx?: SxProps<Theme>
    extraStyle?: React.CSSProperties
    width: string
    extraClasses?: string
}

export default function SideDrawer(props: SideDrawerProps) {
    const { anchor = 'left', onToggleDrawer, children = null, extraStyle = {}, width, isOpen, extraClasses = '' } = props
    const sidebarRef = useRef<HTMLDivElement>(null)

    useOnClickOutside(sidebarRef, () => { onToggleDrawer(false) }, "mousedown", (ev => {
        const target = (ev.target as HTMLElement)
        if (!target) return false
        if (target.classList.contains('wap-edit-toolbar')) return true
        if (target.closest('.wap-edit-toolbar')) return true
        return false
    }))

    function closeDrawerHandler(event: React.KeyboardEvent | MouseEvent | TouchEvent) {
        event.stopPropagation()
        if (
            event &&
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) return
        onToggleDrawer(false)
    }

    return (
        <Drawer
            className={`global-drawer ${extraClasses} flex-shrink-0 ${(anchor === 'right') && 'ml-auto'} ${(anchor === 'bottom') && 'mt-auto'}`}
            ref={sidebarRef}
            anchor={anchor}
            open={isOpen}
            onClose={closeDrawerHandler}
            // ModalProps={{
            //     keepMounted: isOpen, // Better open performance on mobile.
            // }}
            PaperProps={{
                style: {
                    // display:'none',
                    // position: 'absolute',
                    flexDirection: 'row',
                    ...extraStyle
                }
            }}
            BackdropProps={{
                style: {
                    display: 'none',
                    // position: 'absolute',
                    // flexDirection: 'row',
                    // ...extraStyle
                }
            }}
            sx={{
                width,
                // flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 'inherit',
                    boxSizing: 'border-box',
                },
                zIndex: 50000,
                ...extraStyle
                // position: 'absolute',
                // ...extraStyle
            }}
        >
            <div>
                {children}
            </div>
        </Drawer>
    )
}