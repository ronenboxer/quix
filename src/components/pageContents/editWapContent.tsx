"use client"
import WapEditToolBar from "@/components/wap/edit/wapEditToolBar"
import { DOMGridLayout, Flag, Orientation, PageRefMap } from "@/model/DOM"
import { GridLayout, HtmlTags, PageBreakpoint, PageType, SectionType, SizeMap, SizeUnit, Wap, WapContainerEl, WapElement, WapPage, WapSection } from "@/model/wap"
import { Button, ThemeProvider, createTheme, responsiveFontSizes } from "@mui/material"
import { useSnackbar, VariantType, SnackbarKey } from 'notistack'
import { ReactNode, useEffect, useRef, useState } from "react"
import WapEditPreview from "../wap/edit/wapEditPreview"
import { getAbsoluteSize, getElementRefById, makeId } from "@/services/util.service"
import { getAddBpActionLog, getAddSectionActionLog, getRemoveBpActionLog, getSetContainerGridActionLog, getUpdateBpActionLog, getUpdateGridLayoutActionLog } from "@/services/wap.service"
import { WapGridCellSize } from "@/model/wap/misc"

interface WapEditContentProps {
    wap: Wap
    onSetCurrWap: (wap: Wap | null) => void
    onAddActionToLog: (log: 'undo' | 'redo', action: Function, counterAction: Function, cb?: {
        forth: Function,
        back: Function
    }) => void
    onUndo: () => void
    onRedo: () => void
    onCleanRedo: () => void
    isUndoable: boolean
    isRedoable: boolean
}

export default function EditWapContent(props: WapEditContentProps) {
    const { wap, onSetCurrWap, onAddActionToLog, onUndo, onRedo, onCleanRedo, isRedoable, isUndoable } = props
    const snackbarKeys = useRef<{
        [id: string]: SnackbarKey
    }>({})
    // ---MODEL---
    // Wap
    const wapEditPreviewRef = useRef<PageRefMap>({ pageRef: null, sections: {} })

    // Page
    const page = wap.page(Object.keys(wap.pages)[0])
    const [currPage, setCurrPage] = useState(page)

    // International
    const flags: Flag[] = ['us', 'il']
    const [currFlag, setCurrFlag] = useState<Flag>(wap.mainLang)

    // Breakpoint
    const [currScreenWidth, setCurrScreenWidth] = useState<number>(0)
    const [breakpoints, setBreakpoints] = useState<PageBreakpoint[]>(page.formattedBreakpoints)
    const [currBreakpoint, setCurrBreakpoint] = useState<PageBreakpoint>(page.formattedBreakpoints[0])

    // View
    const [currZoomMultiplier, setCurrZoomMultiplier] = useState(1)

    // DOM Selection
    const [inspectedEl, setInspectedEl] = useState<WapElement<HtmlTags> | null>(null)
    const [selectedSection, setSelectedSection] = useState<WapSection<SectionType> | null>(null)
    const [selectedEl, setSelectedEl] = useState<WapElement<HtmlTags> | WapPage<PageType> | null>(null)
    const [selectedGridIdx, setSelectedGridIdx] = useState<{
        orientation: 'rows' | 'cols',
        idx: number
    }>({ orientation: 'rows', idx: -1 })

    // Utils
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    let theme = createTheme()
    theme = responsiveFontSizes(theme)

    // ---FUNCTIONS---
    // Wap
    function setCurrWapHandler(wap: Wap) { onSetCurrWap(wap) }
    function wapEditPreviewRefHandler(ref: HTMLElement | null) {
        if (!wapEditPreviewRef.current.pageRef) wapEditPreviewRef.current.pageRef = ref
    }

    // Pages
    function setCurrPageHandler(pageId: string) {
        if (wap.pages[pageId]!.id === pageId) return
        setCurrPage(wap.pages[pageId]!)
    }
    function getBreadcrumbs() {
        if (!wapEditPreviewRef.current || !selectedEl || selectedEl?.name === 'Page') return []
        let cont: WapContainerEl | WapSection<SectionType> | WapElement<HtmlTags>
        const { breadcrumbs } = getElementRefById(wapEditPreviewRef.current, selectedEl.id)!
        return [currPage, ...breadcrumbs.map((id, idx) => {
            if (idx === 0) {
                cont = currPage.allSections.find(section => section.id === id)!
                if (cont instanceof WapContainerEl) console.log('yes')
            } else if (cont instanceof WapContainerEl) cont = cont.items[id]!
            return cont
        })].slice(0, -1)
    }

    // Sections
    function addSectionHandler(idx: number, sectionType: SectionType, isVertical: boolean, isGlobal: boolean) {
        const res = getAddSectionActionLog(wap, page, idx, sectionType, isVertical, isGlobal)
        if (res.isAdded) {
            const { action, counterAction } = res.payload!
            const actionId = makeId()
            const snackbarResponse = () =>
                renderedSnackbarHandler('Section added', {
                    variant: 'default',
                    action: key => {
                        snackbarKeys.current[actionId] = key
                        return getSnackbarUndo(key)
                    }
                })
            onAddActionToLog('undo', action, counterAction, {
                back: () => {
                    setCurrWapHandler(wap)
                    closeSnackbarById(actionId)
                },
                forth: () => {
                    snackbarResponse()
                    setCurrWapHandler(wap)
                }
            })
            cleanRedoHandler()
            snackbarResponse()
            setCurrWapHandler(wap)
        } else {
            renderedSnackbarHandler(res.message?.toString() || 'Section cannot be added', {
                variant: res.status,
                action: getSnackbarDismiss
            })

        }
        return res
    }
    function contGridLayoutHandler(cont: WapSection<SectionType> | WapContainerEl, grid: GridLayout, bp: number) {
        const contRefObj = getElementRefById(wapEditPreviewRef.current, cont.id)!.map!
        const { sizeMap: colMap, totalUnits: colUnits, absoluteSizes: colSizes, cumulativeSizes: colCumulativeSizes } = getAbsoluteSize(contRefObj.ref!.offsetWidth || 0, cont.gridTemplateCols(bp))
        const { sizeMap: rowMap, totalUnits: rowUnits, absoluteSizes: rowSizes, cumulativeSizes: rowCumulativeSizes } = getAbsoluteSize(contRefObj.ref!.offsetHeight || 0, cont.gridTemplateRows(bp))
        const res = getSetContainerGridActionLog(cont, grid, bp)
        const { action, counterAction } = res.payload!
        const actionId = makeId()
        const snackbarResponse = () => {
            renderedSnackbarHandler(res.message!.toString(), {
                variant: 'default',
                action: key => {
                    snackbarKeys.current[actionId] = key
                    return getSnackbarUndo(key)
                }
            })
        }
        onAddActionToLog('undo', action, counterAction, {
            back: () => {
                setCurrWapHandler(wap)
                closeSnackbarById(actionId)
                snackbarResponse()
                contRefObj.grid = {
                    cols: {
                        ...{ sizeMap: colMap, totalUnits: colUnits, absoluteSizes: colSizes, cumulativeSizes: colCumulativeSizes },
                        idxs: [-1, -1],
                    },
                    rows: {
                        ...{ sizeMap: rowMap, totalUnits: rowUnits, absoluteSizes: rowSizes, cumulativeSizes: rowCumulativeSizes },
                        idxs: [-1, -1],
                    }
                }
            },
            forth: () => {
                snackbarResponse()
                setCurrWapHandler(wap)
                const { sizeMap: colMap, totalUnits: colUnits, absoluteSizes: colSizes, cumulativeSizes: colCumulativeSizes } = getAbsoluteSize(contRefObj.ref!.offsetWidth || 0, cont.gridTemplateCols(bp))
                const { sizeMap: rowMap, totalUnits: rowUnits, absoluteSizes: rowSizes, cumulativeSizes: rowCumulativeSizes } = getAbsoluteSize(contRefObj.ref!.offsetHeight || 0, cont.gridTemplateRows(bp))
                contRefObj.grid = {
                    cols: {
                        ...{ sizeMap: colMap, totalUnits: colUnits, absoluteSizes: colSizes, cumulativeSizes: colCumulativeSizes },
                        idxs: [-1, -1],
                    },
                    rows: {
                        ...{ sizeMap: rowMap, totalUnits: rowUnits, absoluteSizes: rowSizes, cumulativeSizes: rowCumulativeSizes },
                        idxs: [-1, -1],
                    }
                }
            }
        })
        cleanRedoHandler()
        snackbarResponse()
        setCurrWapHandler(wap)
    }

    // Containers
    function updateContainerGridLayoutHandlerDeprecated(props: {
        container: WapContainerEl | WapSection<SectionType>
        size: number,
        sizeMap: { [T in SizeUnit]: number }
        orientation: Orientation
        croppedGrid: DOMGridLayout
        croppedGridComparison: DOMGridLayout
    }) {
        // const res = getUpdateGridLayoutActionLog(props)
        // if (res.isUpdated) {
        //     const { action, counterAction } = res.payload!
        //     onAddActionToLog('undo', action, counterAction, {
        //         back: () => setCurrWapHandler(wap),
        //         forth: () => setCurrWapHandler(wap)
        //     })
        //     cleanRedoHandler()
        // }
    }
    function updateContainerGridLayoutHandler(props: {
        container: WapContainerEl | WapSection<SectionType>
        orientation: Orientation
        gridLayout: WapGridCellSize[],
        bp: number
    }) {
        const res = getUpdateGridLayoutActionLog(props)
        if (res.isUpdated) {
            const { action, counterAction } = res.payload!
            onAddActionToLog('undo', action, counterAction, {
                back: () => setCurrWapHandler(wap),
                forth: () => setCurrWapHandler(wap)
            })
            cleanRedoHandler()
        }
    }

    // Flags
    function setCurrFlagHandler(flag: Flag) { setCurrFlag(flag) }

    // Breakpoints
    function setCurrBreakpointHandler(bpIdx: number, width?: number) {
        const clientWidth = wapEditPreviewRef.current.pageRef!.getBoundingClientRect().width
        const breakpoint = breakpoints[bpIdx]
        if (breakpoint) {
            setCurrBreakpoint(breakpoint)
            if (width) {
                if (width < WapPage.minBreakpoint || width > WapPage.maxBreakpoint || width === currScreenWidth) return
                setCurrScreenWidth(width)
            }
            else {
                if (bpIdx === 0) width = clientWidth > breakpoint.start
                    ? clientWidth
                    : breakpoint.start
                // else if (bpIdx === breakpoints.length-1) width = breakpoints[bpIdx].end
                else width = Math.floor((breakpoint.end! - breakpoint.start) / 2) + breakpoint.start
                setCurrScreenWidth(width)
            }
        }
    }
    function validateUpdatedBreakpointHandler(bpIdx: number, newVal: number) {
        return currPage!.checkExistingBreakpointAvailability(bpIdx, newVal)
    }
    function validateNewBreakPointHandler(breakpoint: number) {
        return currPage!.checkNewBreakpointAvailability(breakpoint)
    }
    function updateBreakpointHandler(bpIdx: number, newBp: number) {
        const res = getUpdateBpActionLog(wap, page, bpIdx, newBp)
        if (res.isUpdated) {
            const { action, counterAction } = res.payload!
            const actionId = makeId()
            const snackbarResponse = () => renderedSnackbarHandler('Breakpoint updated', {
                variant: 'default',
                action: key => {
                    snackbarKeys.current[actionId] = key
                    return getSnackbarUndo(key)
                }
            })
            onAddActionToLog('undo', action, counterAction, {
                back: () => {
                    getBreakpointListHandler()
                    closeSnackbarById(actionId)
                },
                forth: () => {
                    snackbarResponse()
                    getBreakpointListHandler()
                }
            })
            cleanRedoHandler()
            snackbarResponse()
            getBreakpointListHandler()
        } else renderedSnackbarHandler(res.message?.toString() || 'Breakpoint cannot be updated', {
            variant: res.status,
            action: getSnackbarDismiss
        })
        return res
    }
    function addBreakpointHandler(breakpoint: number) {
        const res = getAddBpActionLog(wap, page, breakpoint)
        if (res.isAdded) {
            const { action, counterAction } = res.payload!
            const actionId = makeId()
            const snackbarResponse = () => renderedSnackbarHandler('Breakpoint added', {
                variant: 'default',
                action: key => {
                    snackbarKeys.current[actionId] = key
                    return getSnackbarUndo(key)
                }
            })
            onAddActionToLog('undo', action, counterAction, {
                back: () => {
                    getBreakpointListHandler()
                    closeSnackbarById(actionId)
                },
                forth: () => {
                    snackbarResponse()
                    getBreakpointListHandler()
                }
            })
            cleanRedoHandler()
            snackbarResponse()
            getBreakpointListHandler()
        } else renderedSnackbarHandler(res.message?.toString() || 'Breakpoint cannot be added', {
            variant: res.status,
            action: getSnackbarDismiss
        })
        return res
    }
    function removeBreakpointHandler(bpIdx: number) {
        const res = getRemoveBpActionLog(wap, page, bpIdx)
        if (res.isRemoved) {
            const { action, counterAction } = res.payload!
            const actionId = makeId()
            const snackbarResponse = () => renderedSnackbarHandler('Breakpoint deleted with all its properties', {
                variant: 'default',
                action: key => {
                    snackbarKeys.current[actionId] = key
                    return getSnackbarUndo(key)
                }
            })
            onAddActionToLog('undo', action, counterAction, {
                back: () => {
                    getBreakpointListHandler()
                    closeSnackbarById(actionId)
                },
                forth: () => {
                    snackbarResponse()
                    getBreakpointListHandler()
                }
            })
            cleanRedoHandler()
            snackbarResponse()
            getBreakpointListHandler(bpIdx === page.breakpoints.length
                ? bpIdx
                : -1)
        } else renderedSnackbarHandler(res.message?.toString() || 'Breakpoint cannot be deleted', {
            variant: res.status,
            action: getSnackbarDismiss
        })
        return res
    }
    function getBreakpointListHandler(newBpIdx: number = -1) {
        const breakpoints = currPage.formattedBreakpoints
        if (newBpIdx !== -1 && breakpoints[newBpIdx]) { setCurrBreakpoint(breakpoints[newBpIdx]) }
        if (currPage) setBreakpoints(breakpoints)
    }
    function setCurrScreenWidthHandler(width: number) {
        if (width < WapPage.minBreakpoint) width = WapPage.minBreakpoint
        const bpIdx = currPage.correspondingBreakpointIdx(width)
        setCurrBreakpointHandler(bpIdx, width)
    }

    // Zoom
    function currZoomMultiplierHandler(zoom: number = 1) { setCurrZoomMultiplier(zoom) }

    // Actions
    function undoHandler() { onUndo() }
    function redoHandler() { onRedo() }
    function cleanRedoHandler() { onCleanRedo() }

    // DOM Selection
    function setInspectedElHandler(el: WapElement<HtmlTags> | null) { setInspectedEl(el) }
    function selectedElHandler(el: WapElement<HtmlTags> | WapPage<PageType> | null) {
        if (el?.id !== selectedEl?.id) {
            setSelectedEl(el)
            selectGridIdxHandler(-1)
        }
    }
    function selectedSectionHandler(section: WapSection<SectionType> | null) {
        if (section?.id !== selectedSection?.id) {
            setSelectedSection(_ => section)
            selectGridIdxHandler(-1)
        }
    }
    function selectGridIdxHandler(idx: number, orientation: 'rows' | 'cols' = 'cols') {
        setSelectedGridIdx({ idx, orientation })
    }

    // ---UTILS Functions
    // Snackbar
    function renderedSnackbarHandler(message: string,
        { variant = 'default', action }: { variant?: VariantType, action?: (key: SnackbarKey) => ReactNode }) {
        enqueueSnackbar({
            message,
            variant,
            action
        })
    }
    function closeSnackbarHandler(key: SnackbarKey) { closeSnackbar(key) }
    function closeSnackbarById(id: string) {
        if (!snackbarKeys.current[id]) return
        closeSnackbarHandler(snackbarKeys.current[id])
        delete snackbarKeys.current[id]
    }
    function getSnackbarUndo(key: SnackbarKey) {
        return <>
            <Button className="actions action-button" sx={{ color: 'white' }} onClick={() => {
                undoHandler()
                // closeSnackbarHandler(key)
            }}>Undo</Button>
            {getSnackbarDismiss(key)}
        </>
    }
    function getSnackbarDismiss(key: SnackbarKey) {
        return <Button sx={{ color: 'white' }} onClick={() => closeSnackbarHandler(key)}>Dismiss</Button>
    }
    useEffect(() => {
        if (!currScreenWidth && wapEditPreviewRef.current.pageRef) setCurrScreenWidthHandler(wapEditPreviewRef.current.pageRef.getBoundingClientRect().width)
    }, [wapEditPreviewRef.current])

    return (
        <ThemeProvider theme={theme}>
            <WapEditToolBar
                wap={wap}
                flags={flags}
                currFlag={currFlag}
                onSetCurrFlag={setCurrFlagHandler}
                currPageId={currPage.id}
                onSetCurrPage={setCurrPageHandler}
                currBreakpoint={currBreakpoint}
                onSetCurrBreakpoint={setCurrBreakpointHandler}
                breakpoints={breakpoints}
                currScreenWidth={currScreenWidth}
                onSetCurrScreenWidth={setCurrScreenWidthHandler}
                currZoomMultiplier={currZoomMultiplier}
                onSetCurrZoomMultiplier={currZoomMultiplierHandler}
                onAddBreakpoint={addBreakpointHandler}
                onRemoveBreakpoint={removeBreakpointHandler}
                onUpdateBreakpoint={updateBreakpointHandler}
                onValidateNewBreakpoint={validateNewBreakPointHandler}
                onValidateUpdateBreakpoint={validateUpdatedBreakpointHandler}
                isUndoable={isUndoable}
                isRedoable={isRedoable}
                onUndo={undoHandler}
                onRedo={redoHandler}
                selectedEl={selectedEl}
                onSetSelectedEl={selectedElHandler}
                breadcrumbs={getBreadcrumbs()}
            />
            <WapEditPreview
                wap={wap}
                pageRefMap={wapEditPreviewRef.current}
                onSetWapEditPreviewRef={wapEditPreviewRefHandler}
                currPage={currPage}
                currBreakpoint={currBreakpoint}
                currScreenWidth={currScreenWidth}
                onSetCurrScreenWidth={setCurrScreenWidthHandler}
                selectedEl={selectedEl}
                onSetSelectedEl={selectedElHandler}
                selectedGridIdx={selectedGridIdx}
                onSelectGridIdx={selectGridIdxHandler}
                onAddSection={addSectionHandler}
                onSetGridLayout={contGridLayoutHandler}
                onUpdateGridLayout={updateContainerGridLayoutHandler}
            />
        </ThemeProvider>
    )
}