import { useSvg } from "@/components/shared/useSvg";
import DropdownMenu from "@/components/ui/dropdownMenu";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";

interface NotificationMenuProps {

}

export default function NotificationMenu(props: NotificationMenuProps) {

    const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false)

    const header = <Box
        sx={{
            display: 'flex',
            gap: '8px',
            padding: '16px',
            alignItems: 'flex-end',
        }}
    >
        <Typography sx={{
            fontWeight: '500',
            fontSize: '1.2rem',
            marginInlineEnd: 'auto',
            padding:'6px'
        }}>
            Notifications
        </Typography>
        <Button sx={{
            borderInlineEnd: '1px solid #e5e5e5',
            fontWeight: 200,
            fontSize: '.9rem',
            textTransform:'capitalize',
            letterSpacing:'auto'
        }}>Mark All as Read</Button>
        <Button sx={{
            fontWeight: 200,
            fontSize: '.9rem',
            textTransform:'capitalize',
            letterSpacing:'auto'
        }}>Settings</Button>
    </Box>
    const button = useSvg('headerNotification')

    function getNotificationList() {
        return <div>
            <ul>
                <li>1</li>
                <li>1</li>
                <li>1</li>
                <li>1</li>
            </ul>
        </div>
    }

    function toggleNotificationMenuHandler(state: boolean) {
        setIsNotificationsMenuOpen(state)
    }

    return (
        <DropdownMenu
            header={header}
            buttonContent={button}
            extraStyle={{
                width: '380px',
                padding: '10px'
            }}
            name="notifications"
            isMenuOpen={isNotificationsMenuOpen}
            onSetIsMenuOpen={toggleNotificationMenuHandler}
            placement="bottom-end"
            extraClasses="notifications-menu"
        >
            {getNotificationList()}
        </DropdownMenu>
    )
}