import { AppBar, Container, Toolbar, Typography, Box, IconButton, Menu, MenuItem, Button, Tooltip, Avatar, createTheme, ThemeProvider, Divider } from "@mui/material"
import { useState } from "react"
import MenuIcon from '@mui/icons-material/Menu'
import AppLogo from "@/components/shared/logo"
import useWindowSize from "@/hooks/useWindowSize"
import { ItemList } from "@/model/DOM"
import LanguageTwoToneIcon from '@mui/icons-material/LanguageTwoTone'
import FileCopyTwoToneIcon from '@mui/icons-material/FileCopyTwoTone'
import ConstructionTwoToneIcon from '@mui/icons-material/ConstructionTwoTone'
import { blue, deepPurple, grey } from "@mui/material/colors"
import { useRouter } from "next/navigation"

export default function AppNav() {
    const router = useRouter()
    const navItems: ItemList = [
        {
            title: 'My Sites',
            name: 'My Sites',
            icon: <LanguageTwoToneIcon />
        },
        {
            title: 'Templates',
            name: 'Templates',
            icon: <FileCopyTwoToneIcon />
        },
        {
            title: 'Tools',
            name: 'Tools',
            icon: <ConstructionTwoToneIcon />
        },]

    const settings = ['Profile', 'Account', 'Dashboard', 'Logout']

    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)
    const [isSidebarNavOpen, setIsSidebarNavOpen] = useState<boolean>(false)

    const windowSize = useWindowSize()

    const breakpoints = {
        values: {
            xs: 0,
            sm: 400,
            md: 800,
            lg: 1200,
            xl: 1536
        }
    }

    const theme = createTheme({
        breakpoints,
        palette: {
            background: {
                paper: '#fff',
            },
            text: {
                primary: '#333',
                secondary: blue[900]
            },
            action: {
                active: deepPurple[400],
                hover: blue[700],
                selected: blue[200],
                disabled: grey[500],
            }
        }
    })

    function handleOpenUserMenu(event: React.MouseEvent<HTMLElement>) {
        setAnchorElUser(event.currentTarget)
    }

    function handleCloseUserMenu() {
        setAnchorElUser(null)
    }

    function sidebarNavToggleHandler(newState: boolean = !isSidebarNavOpen) {
        setIsSidebarNavOpen(newState)
    }

    function navigateHandler(href: string = '/') {
        router.push(href)
    }

    return (
        <section className="app-nav relative">
            <ThemeProvider theme={theme}>
                <AppBar position="static" sx={{
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: 'none'
                }}>
                    <Container maxWidth="xl">
                        <Toolbar disableGutters >
                            <Typography
                                variant="h5"
                                noWrap
                                component="a"
                                href=""
                                sx={{
                                    marginInlineEnd: 2,
                                    paddingBlock: 'auto',
                                    display: { xs: 'none', sm: 'flex' },
                                    fontFamily: '"Exo 2"',
                                    fontWeight: 200,
                                    letterSpacing: '.3rem',
                                    color: 'text.primary',
                                    textDecoration: 'none',
                                }}
                            >
                                <AppLogo />

                            </Typography>
                            <Divider />
                            <Box sx={{
                                flexGrow: 0,
                                display: { xs: 'none', sm: 'flex' },
                                borderInlineStart: '1px solid #e5e5e5',
                                paddingInlineStart: 2,
                                gap: 1
                            }}>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu}
                                        sx={{
                                            p: 0,
                                            flexGrow: 0,
                                            height: 'fit-content',
                                            alignSelf: 'center',
                                        }}>
                                        <Avatar alt="Remy Sharp" src="" />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {settings.map((setting) => (
                                        <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                            <Typography textAlign="center">{setting}</Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                                {navItems.map((item) => (
                                    <Button
                                        key={item.title}
                                        sx={{
                                            my: 2, color: 'text.primary', display: 'block', ":hover": {
                                                color: 'action.hover'
                                            }
                                        }}
                                    >
                                        {item.title}
                                    </Button>
                                ))}
                            </Box>

                            <Box sx={{
                                flexGrow: 1,
                                display: { xs: 'flex', sm: 'none' },
                                justifyContent: 'space-between'
                            }}>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={() => sidebarNavToggleHandler(true)}
                                    color="inherit"
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar alt="Remy Sharp" src="" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
                {/* <SideDrawerShit
                    isSidebarNavOpen={isSidebarNavOpen && windowSize.width < breakpoints.values.sm}
                    onSidebarNavToggle={sidebarNavToggleHandler}
                    items={navItems}
                /> */}
            </ThemeProvider>
        </section>
    )
}