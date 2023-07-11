import { useSvg } from "@/components/shared/useSvg";
import DropdownMenu from "@/components/ui/dropdownMenu";
import { OperationStatus, ScreenType, WapPage } from "@/model/wap";
import { Box, Button, Divider, IconButton, Tooltip, Typography } from "@mui/material";
import EditBreakpointForm from "./editBreakpointForm";
import { useState } from "react";
import NewBreakpointForm from "./newBreakpointForm";

interface BreakpointsMenuProps {
    isBreakpointsMenuOpen: boolean
    onSetIsBreakpointsMenuOpen: (state: boolean) => void
    breakpoints: {
        start: number
        end: number | null
        text: string
        screenType: ScreenType
    }[]
    onUpdateBreakpoint: (bpIdx: number, newVal: number) => OperationStatus<"isUpdated", number>
    onValidateUpdatedBreakpoint: (bpIdx: number, newVal: number) => OperationStatus<"isAvailable", number>
    onAddBreakpoint: (newVal: number) => OperationStatus<"isAdded">
    onValidateNewBreakpoint: (newVal: number) => OperationStatus<"isAvailable">
    maxBreakpointCount: number
    onRemoveBreakpoint: (bpIdx: number) => void
}

export default function BreakpointsMenu(props: BreakpointsMenuProps) {
    const { isBreakpointsMenuOpen, onSetIsBreakpointsMenuOpen, breakpoints,
        onValidateUpdatedBreakpoint, onUpdateBreakpoint, onValidateNewBreakpoint, onAddBreakpoint,
        maxBreakpointCount, onRemoveBreakpoint } = props
    const [currEditedBreakpointIdx, setCurrEditedBreakpointIdx] = useState<null | number>(null)
    const button = useSvg('...')
    const header = <Box className="breakpoint-toolbar-menu-header">
        <Box className="flex items-center pt-8 pe-8 pb-8 ps-16">
            <Typography className="fs-10-rem fw-600">
                    Customizable Breakpoints</Typography>
            <IconButton
                className="flex-shrink-1 ms-auto"
                sx={{
                    color: 'text.primary',
                }}>{useSvg('help')}</IconButton>
            <IconButton
                className="flex-shrink-1"
                sx={{
                    color: 'text.primary',
                }} onClick={closeBreakpointsMenuHandler}>{useSvg('close')}</IconButton>
        </Box>
        <Divider />
        <Typography className="py-8 px-16 .cloudy-sky fs-080-rem we-300">
            Add, edit or delete this page's breakpoints to design for different viewport sizes.
        </Typography>

    </Box>
    const footer = <Box className="breakpoint-toolbar-menu-footer flex center pa-8 w-100">
        <Tooltip
            title={breakpoints.length >= maxBreakpointCount
                ? `You can add up to ${maxBreakpointCount} custom breakpoints to each page.`
                : ''}
        >
            <span className="w-100">
                <Button
                    className="w-100 fs-075-rem"
                    disabled={breakpoints.length >= maxBreakpointCount}
                    onClick={addNewBreakpointHandler}
                >
                    + Add Breakpoint
                </Button>
            </span>
        </Tooltip>
    </Box>


    function validateUpdatedBreakpointHandler(bpIdx: number, newVal: number) {
        return onValidateUpdatedBreakpoint(bpIdx, newVal)
    }
    function updateBreakpointHandler(bpIdx: number, newVal: number) {
        return onUpdateBreakpoint(bpIdx, newVal)
    }
    function validateNewBreakPointHandler(breakpoint: number) {
        return onValidateNewBreakpoint(breakpoint)
    }
    function addBreakpointHandler(breakpoint: number) {
        const res = onAddBreakpoint(breakpoint)
        if (res.isAdded) setCurrEditedBreakpointHandler()
        return res
    }

    function setCurrEditedBreakpointHandler(idx: number = -1) {
        if (idx === -1) setCurrEditedBreakpointIdx(null)
        else setCurrEditedBreakpointIdx(idx)
    }

    function addNewBreakpointHandler() {
        setCurrEditedBreakpointIdx(breakpoints.length)
    }

    function removeBreakpointHandler(bpIdx: number) {
        onRemoveBreakpoint(bpIdx)
    }

    function getBreakpointList() {
        return [
            ...breakpoints.map((bp, idx) => <EditBreakpointForm
                key={'breakpoint-menu-item-' + bp.start}
                breakpoint={bp}
                bpIdx={idx - 1}
                onEditBreakpointSubmit={updateBreakpointHandler}
                onEditBreakpointInput={validateUpdatedBreakpointHandler}
                currEditedBpIdx={currEditedBreakpointIdx}
                onSetCurrEditedBreakpoint={setCurrEditedBreakpointHandler}
                onRemoveBreakpoint={removeBreakpointHandler}
            />),
            currEditedBreakpointIdx === breakpoints.length
                ? <NewBreakpointForm
                    key="new-breakpoint"
                    breakpoint={1279}
                    onNewBreakpointInput={validateNewBreakPointHandler}
                    onNewBreakpointSubmit={addBreakpointHandler}
                    onSetCurrEditedBreakpoint={setCurrEditedBreakpointHandler}
                />
                : null
        ]
    }

    function toggleBreakpointsMenuHandler(state: boolean) {
        onSetIsBreakpointsMenuOpen(state)
        if (!state) setCurrEditedBreakpointHandler()
    }

    function closeBreakpointsMenuHandler() {
        toggleBreakpointsMenuHandler(false)
    }
    return (
        <DropdownMenu
            buttonContent={button}
            isMenuOpen={isBreakpointsMenuOpen}
            onSetIsMenuOpen={toggleBreakpointsMenuHandler}
            name="breakpoints-list"
            placement="bottom-start"
            header={header}
            footer={footer}
            buttonToolTip="Customize Breakpoints"
            extraClasses="breakpoints-toolbar-menu"
        >
            {getBreakpointList()}
        </DropdownMenu>
    )
}