"use client"

import { Container } from "@mui/material"
import { SnackbarProvider } from "notistack"

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SnackbarProvider maxSnack={3}>
            <Container sx={{
                flexGrow:1,
                padding: '0 !important',
                margin: '0 !important',
                width: '100%',
                maxWidth: 'unset !important',
                height: '100%',
                display:'flex',
                flexDirection: 'column',
            }}>

                {children}
            </Container>
        </SnackbarProvider>

    )
}
