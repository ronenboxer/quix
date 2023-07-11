"use client"

import { ReactNode } from "react"
import AppNav from "./shared/appNav"
import { Container, ThemeProvider, createTheme } from "@mui/material"
import { grey } from "@mui/material/colors"

export default function AppLayout({ children }: {
    children: ReactNode
}) {
    const theme = createTheme({
        palette: {
            primary: {
                main: grey[400],
                light: grey[200],
                dark: grey[800],

            },
            background: {
                paper: '#fff',
            },
            text: {
                primary: '#2962ff',
                secondary: '#46505A',
            },
            action: {
                active: '#173A5E',
                focus: '#2962ff'
            },
        },
    })
    return (
        <ThemeProvider theme={theme}>
            <Container sx={{
                width: '100dvw',
                maxWidth:'unset !important',
                height: '100dvh',
                display: 'flex',
                flexDirection: 'column',
                padding: '0 !important',
                margin: '0 !important'
            }}>

                <AppNav />
                {children}
            </Container>
        </ThemeProvider>
    )
}