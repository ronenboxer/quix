import { Flag } from "../../../model/DOM"
import { AppBar, Box, Container, ThemeProvider, Toolbar, createTheme } from "@mui/material"
import { useEffect, useState } from "react"
import { HtmlTags, OperationStatus, PageBreakpoint, PageType, SectionType, Wap, WapContainerEl, WapElement, WapPage, WapSection } from "@/model/wap"
import { grey, blue, deepPurple } from "@mui/material/colors"
import LangListMenu from "./toolbar/langListMenu"
import PageListMenu from "./toolbar/pageListMenu"
import BreakpointsController from "./toolbar/breakpointsController"
import WapEditTools from "./toolbar/wapEditTools"
import ZoomMenu from "./toolbar/zoomMenu"
import ActionsBox from "./toolbar/actionsBox"
import MiscTools from "./toolbar/miscTools"


interface WapEditToolbarProps {
    wap: Wap
    flags: Flag[]
    currFlag: Flag
    onSetCurrFlag: (flag: Flag) => void
    currPageId: string
    onSetCurrPage: (id: string) => void
    breakpoints: PageBreakpoint[]
    currBreakpoint: PageBreakpoint
    onSetCurrBreakpoint: (bpIdx: number, width?: number) => void
    currScreenWidth: number
    onSetCurrScreenWidth: (width: number) => void
    currZoomMultiplier: number
    onSetCurrZoomMultiplier: (zoom: number) => void
    onValidateUpdateBreakpoint: (bpIdx: number, newVal: number) => OperationStatus<"isAvailable">
    onValidateNewBreakpoint: (newVal: number) => OperationStatus<"isAvailable">
    onUpdateBreakpoint: (bpIdx: number, newVal: number) => OperationStatus<"isUpdated">
    onAddBreakpoint: (bp: number) => OperationStatus<"isAdded">
    onRemoveBreakpoint: (bpIdx: number) => OperationStatus<"isRemoved">,
    isUndoable: boolean
    isRedoable: boolean
    onUndo: () => void
    onRedo: () => void
    selectedEl: WapPage<PageType> | WapSection<SectionType> | WapContainerEl | WapElement<HtmlTags> | null
    onSetSelectedEl: (el: WapElement<HtmlTags> | WapPage<PageType> | null) => void
    breadcrumbs: (WapPage<PageType> | WapContainerEl | WapSection<SectionType> | WapElement<HtmlTags>)[]
}

const MAX_BREAKPOINT_COUNT = WapPage.maxBreakpointCount

export default function WapEditToolBar(props: WapEditToolbarProps) {
    const { wap, flags, currFlag, onSetCurrFlag, currPageId, onSetCurrPage, breakpoints, currBreakpoint, onSetCurrBreakpoint, currScreenWidth, onSetCurrScreenWidth, currZoomMultiplier, onSetCurrZoomMultiplier, onAddBreakpoint, onRemoveBreakpoint, onUpdateBreakpoint, onValidateNewBreakpoint, onValidateUpdateBreakpoint, isRedoable, isUndoable, onRedo, onUndo, selectedEl, onSetSelectedEl, breadcrumbs } = props

    // Menus togglers
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
    const [isPageMenuOpen, setIsPageMenuOpen] = useState(false)
    const [isBreakpointsMenuOpen, setIsBreakpointsMenuOpen] = useState(false)
    const [commentsAndInspectorDrawer, setCommentsAndInspectorDrawer] = useState<'comments' | 'inspector' | null>(null)

    const theme = createTheme({
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
                hover: grey[100],
                selected: blue[100],
                disabled: grey[500],
            }
        }
    })


    // Languages
    function toggleLangMenuHandler(state: boolean) { setIsLangMenuOpen(state) }
    function selectLangHandler(flag: Flag) { onSetCurrFlag(flag) }

    // Pages
    function togglePageMenuHandler(state: boolean) { setIsPageMenuOpen(state) }
    function selectPageHandler(pageId: string) { onSetCurrPage(pageId) }

    // Breakpoints
    function toggleBreakpointsMenuHandler(state: boolean) { setIsBreakpointsMenuOpen(state) }
    function validateUpdatedBreakpointHandler(bpIdx: number, newVal: number) { return onValidateUpdateBreakpoint(bpIdx, newVal) }
    function validateNewBreakPointHandler(breakpoint: number) { return onValidateNewBreakpoint(breakpoint) }
    function updateBreakpointHandler(bpIdx: number, newVal: number) { return onUpdateBreakpoint(bpIdx, newVal) }
    function addBreakpointHandler(breakpoint: number) { return onAddBreakpoint(breakpoint) }
    function removeBreakpointHandler(bpIdx: number) { return onRemoveBreakpoint(bpIdx) }
    function setCurrBreakpointHandler(bpIdx: number, width?: number) { onSetCurrBreakpoint(bpIdx, width) }
    function setCurrScreenWidthHandler(width: number) { onSetCurrScreenWidth(width) }

    // Zoom
    function zoomMultiplierHandler(zoom: number = 1) { onSetCurrZoomMultiplier(zoom) }

    // Actions
    function undoHandler() { onUndo() }
    function redoHandler() { onRedo() }

    // Inspector
    function setCommentsAndInspectorDrawerHandler(drawer: 'comments' | 'inspector' | null = null) {
        setCommentsAndInspectorDrawer(!drawer || drawer === commentsAndInspectorDrawer
            ? null
            : drawer)
    }
    function selectedElHandler(el: WapElement<HtmlTags> | WapPage<PageType> | null) { onSetSelectedEl(el) }

    useEffect(() => {

    }, [])

    return (
        <ThemeProvider theme={theme}>

            <AppBar position="static"
                className="wap-edit-toolbar justify-start"
                sx={{
                    color: 'text.primary',
                    textDecoration: 'none',
                    bgcolor: 'background.paper',
                    boxShadow: 'none',
                }}
            >
                <Container className="mx-0">
                    <Toolbar disableGutters className="tools">
                        <WapEditTools />
                        <LangListMenu
                            flags={flags}
                            isLangListMenuOpen={isLangMenuOpen}
                            onSetIsLangListMenuOpen={toggleLangMenuHandler}
                            theme={theme}
                            onSelectLang={selectLangHandler}
                            currFlag={currFlag}
                        />
                        <PageListMenu
                            pages={wap.formattedPages}
                            isPageListMenuOpen={isPageMenuOpen}
                            onSetIsPageListMenuOpen={togglePageMenuHandler}
                            theme={theme}
                            onSelectPage={selectPageHandler}
                            currPageId={currPageId}
                        />
                        <BreakpointsController
                            breakpoints={breakpoints}
                            currBreakpoint={currBreakpoint}
                            onSetCurrBreakpoint={setCurrBreakpointHandler}
                            currScreenWidth={currScreenWidth}
                            onSetCurrScreenWidth={setCurrScreenWidthHandler}
                            isBreakpointsMenuOpen={isBreakpointsMenuOpen}
                            onSetIsBreakpointsMenuOpen={toggleBreakpointsMenuHandler}
                            onUpdateBreakpoint={updateBreakpointHandler}
                            onValidateUpdatedBreakpoint={validateUpdatedBreakpointHandler}
                            onAddBreakpoint={addBreakpointHandler}
                            onValidateNewBreakpoint={validateNewBreakPointHandler}
                            onRemoveBreakpoint={removeBreakpointHandler}
                            maxBreakpointCount={MAX_BREAKPOINT_COUNT}
                        />
                        <ZoomMenu
                            currZoomMultiplier={currZoomMultiplier}
                            onSetZoomMultiplier={zoomMultiplierHandler}
                        />
                        <ActionsBox
                            isUndoable={isUndoable}
                            isRedoable={isRedoable}
                            onUndo={undoHandler}
                            onRedo={redoHandler}
                        />
                        <MiscTools
                            currDrawer={commentsAndInspectorDrawer}
                            onSetDrawer={setCommentsAndInspectorDrawerHandler}
                            selectedEl={selectedEl}
                            onSetSelectedEl={selectedElHandler}
                            breadcrumbs={breadcrumbs}
                        />
                    </Toolbar>
                </Container>
            </AppBar>
        </ThemeProvider>
    )
}