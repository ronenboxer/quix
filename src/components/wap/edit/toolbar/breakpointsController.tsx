import { SVG } from "@/components/shared/useSvg"
import { useSvg } from "@/components/shared/useSvg"
import { OperationStatus, PageBreakpoint, WapPage } from "@/model/wap"
import { Box, Icon, IconButton, Tab, Tooltip, Typography } from "@mui/material"
import Tabs, { tabsClasses } from '@mui/material/Tabs'
import { blue, grey } from "@mui/material/colors"
import BreakpointsMenu from "./breakpoint/breakpointsMenu"
import ScreenWidthController from "./breakpoint/screenWidthController"
import { useEffect, useState } from "react"

interface BreakpointControllerProps {
    breakpoints: PageBreakpoint[]
    currBreakpoint: PageBreakpoint
    onSetCurrBreakpoint: (bpIdx: number, width?: number) => void
    currScreenWidth: number
    onSetCurrScreenWidth: (screenWidth: number) => void
    isBreakpointsMenuOpen: boolean
    onSetIsBreakpointsMenuOpen: (state: boolean) => void
    onUpdateBreakpoint: (bpIdx: number, newVal: number) => OperationStatus<"isUpdated", number>
    onValidateUpdatedBreakpoint: (bpIdx: number, newVal: number) => OperationStatus<"isAvailable", number>
    onAddBreakpoint: (newVal: number) => OperationStatus<"isAdded">
    onValidateNewBreakpoint: (newVal: number) => OperationStatus<"isAvailable">
    maxBreakpointCount: number
    onRemoveBreakpoint: (bpIdx: number) => void
}


export default function BreakpointsController(props: BreakpointControllerProps) {
    const { breakpoints, currBreakpoint, currScreenWidth, onSetCurrScreenWidth, onSetIsBreakpointsMenuOpen, isBreakpointsMenuOpen, onValidateUpdatedBreakpoint, onUpdateBreakpoint, onValidateNewBreakpoint, onAddBreakpoint,
        maxBreakpointCount, onRemoveBreakpoint, onSetCurrBreakpoint } = props

    const tempBpIdx = breakpoints.findIndex(bp => bp.start === currBreakpoint.start)
    const [bpIdx, setBpIdx] = useState(tempBpIdx === -1
        ? Math.max(breakpoints.length - 1, 0)
        : Math.max(tempBpIdx, 0))

    function toggleBreakpointsMenuHandler(state: boolean) {
        onSetIsBreakpointsMenuOpen(state)
    }
    function validateUpdatedBreakpointHandler(bpIdx: number, newVal: number) {
        return onValidateUpdatedBreakpoint(bpIdx, newVal)
    }
    function validateNewBreakPointHandler(breakpoint: number) {
        return onValidateNewBreakpoint(breakpoint)
    }
    function updateBreakpointHandler(bpIdx: number, newVal: number) {
        return onUpdateBreakpoint(bpIdx, newVal)
    }
    function addBreakpointHandler(breakpoint: number) {
        return onAddBreakpoint(breakpoint)
    }
    function removeBreakpointHandler(bpIdx: number) {
        if (bpIdx >= breakpoints.length - 2) setCurrBreakpointHandler(null, Math.max(bpIdx - 1, 0))
        onRemoveBreakpoint(bpIdx)
    }
    function setCurrBreakpointHandler(event: React.SyntheticEvent | null, bpIdx: number) {
        onSetCurrBreakpoint(bpIdx)
        setBpIdx(bpIdx)
    }
    function setCurrScreenWidthHandler(width: number) { onSetCurrScreenWidth(width) }

    function getHeaderBreakpoints() {
        return breakpoints.map((bp, idx) =>
            <Tooltip
                className="breakpoint-tab pa-8"
                key={bp.text} disableFocusListener disableTouchListener title={
                    <Box sx={{
                        // padding: '8px',
                        // maxWidth: '220px'
                    }}>
                        <Box
                            className="flex gap-8 items-center"
                            sx={{
                                // display: 'flex',
                                // gap: '8px',
                                // alignItems: 'center'
                            }}>
                            <Typography
                                className="fs-085-rem fw-500 capitalize"
                                sx={{
                                    // fontSize: '.85rem',
                                    // fontWeight: '500',
                                    // textTransform: 'capitalize'
                                }}>{bp.screenType}
                            </Typography>
                            <Typography
                                className="fs-075-rem fw-200"
                                sx={{
                                    // fontSize: '.75rem',
                                    // fontWeight: '200'
                                }}>
                                {idx === 0
                                    ? '(Primary)'
                                    : '(' + bp.text + ')'
                                }
                            </Typography>
                        </Box>
                        <Typography
                            className="fs-075-rem fw-200"
                            sx={{
                                // fontSize: '.75rem',
                                // fontWeight: '200'
                            }}>
                            Changes cascade down to {idx === 0
                                ? 'all screen sizes'
                                : 'screens smaller than ' + bp.end! + 'px'}, unless you customize lower breakpoints.
                        </Typography>
                    </Box>
                }>
                <Tab
                    sx={{
                        width: '40px',
                        minWidth: '40px'
                    }}
                    label={useSvg('header_' + bp.screenType as SVG)} />
            </Tooltip>
        )

    }

    useEffect(() => {
        setBpIdx(breakpoints.findIndex(bp => bp.start === currBreakpoint.start))
    }, [currScreenWidth, currBreakpoint])

    return (
        <>
            <Box className="breakpoints-tools ms-auto flex items-center w-fit">
                {breakpoints.length && bpIdx < breakpoints.length && <Tabs
                    className="breakpoints-tabs"
                    value={bpIdx}
                    onChange={setCurrBreakpointHandler}
                    variant="scrollable"
                    scrollButtons
                    aria-label="breakpoint list tabs"
                    sx={{
                        [`& .${tabsClasses.scrollButtons}`]: {
                            '&.Mui-disabled': { opacity: 0.3 },
                        },
                        width: '200px'
                    }}
                >

                    {getHeaderBreakpoints()}
                </Tabs>}
                <BreakpointsMenu
                    onSetIsBreakpointsMenuOpen={toggleBreakpointsMenuHandler}
                    isBreakpointsMenuOpen={isBreakpointsMenuOpen}
                    breakpoints={breakpoints}
                    onUpdateBreakpoint={updateBreakpointHandler}
                    onValidateUpdatedBreakpoint={validateUpdatedBreakpointHandler}
                    onAddBreakpoint={addBreakpointHandler}
                    onValidateNewBreakpoint={validateNewBreakPointHandler}
                    maxBreakpointCount={maxBreakpointCount}
                    onRemoveBreakpoint={removeBreakpointHandler}
                />
                <ScreenWidthController
                    currScreenWidth={currScreenWidth}
                    onSetCurrScreenWidth={setCurrScreenWidthHandler}
                />
            </Box>
        </>
    )
}