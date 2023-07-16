import { SVG, useSvg } from "@/components/shared/useSvg"
import { OperationStatus, ScreenType, WapPage } from "@/model/wap"
import { capitalize } from "@/services/util.service"
import { Box, Button, Icon, IconButton, InputAdornment, OutlinedInput, Tooltip, Typography } from "@mui/material"
import { blue, grey } from "@mui/material/colors"
import { ChangeEvent, useEffect, useRef, useState } from "react"

interface EditBreakpointFormProps {
    breakpoint: {
        start: number
        end: number | null
        text: string
        screenType: ScreenType
    }
    bpIdx: number
    currEditedBpIdx: number | null
    onEditBreakpointSubmit: (bpIdx: number, newVal: number) => OperationStatus<"isUpdated", number>
    onEditBreakpointInput: (bpIdx: number, newVal: number) => OperationStatus<"isAvailable", number>
    onSetCurrEditedBreakpoint: (idx?: number) => void
    onRemoveBreakpoint: (bpIdx: number) => void
}

export default function EditBreakpointForm(props: EditBreakpointFormProps) {
    const { breakpoint, bpIdx, onEditBreakpointInput, onEditBreakpointSubmit,
        currEditedBpIdx, onSetCurrEditedBreakpoint, onRemoveBreakpoint } = props
    const [isBeingEdited, setIsBeingEdited] = useState(false)
    const [inputFeedback, setInputFeedback] = useState<string | null>(null)
    const [isValid, setIsValid] = useState(true)
    const [newVal, setNewVal] = useState<number>(breakpoint.start === WapPage.minBreakpoint
        ? breakpoint.start
        : breakpoint.start + 1)
    const isEditable = !!breakpoint.end
    const inputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    function discardEditHandler() {
        setCurrEditedBreakpointHandler()
        if (!inputRef.current) return
        inputRef.current!.defaultValue = breakpoint.end! + ''
    }

    function endEditHandler() {
        setIsBeingEdited(false)
        setIsValid(true)
        setInputFeedback(null)
    }

    function startEditHandler() {
        setIsBeingEdited(true)
    }

    function inputKeyDownHandler(ev: KeyboardEvent) {
        if (!isValid) return
        if (ev.key === 'Enter') submitEditBreakpointHandler()
    }

    function validateInputHandler(ev: ChangeEvent<HTMLInputElement>) {
        const val = +ev.target.value
        const res = onEditBreakpointInput(bpIdx, val)
        handleInputFeedback(res.message?.toString())
        setNewVal(val)
    }

    function handleInputFeedback(message: string | null = null) {
        if (inputFeedback !== message) setInputFeedback(message)
        if (message) {
            if (isValid) setIsValid(false)
        }
        else if (!isValid) setIsValid(true)
    }

    function submitEditBreakpointHandler() {
        const res = newVal === breakpoint.end!
            ? {
                isAvailable: true,
                status: 'success',
                message: 'Skipped update due to new value being equal to old value.'
            }
            : onEditBreakpointInput(bpIdx, newVal)
        setCurrEditedBreakpointHandler()
        if (res.isAvailable) return onEditBreakpointSubmit(bpIdx, newVal)
        handleInputFeedback(res.message?.toString())
    }

    function setCurrEditedBreakpointHandler(idx: number = -1) {
        onSetCurrEditedBreakpoint(idx)
    }


    function removeBreakpointHandler() {
        onRemoveBreakpoint(bpIdx)
    }

    useEffect(() => {
        if (currEditedBpIdx === bpIdx) startEditHandler()
        else endEditHandler()
    }, [currEditedBpIdx])

    return (
        <Box
            className={`edit-breakpoint-form flex py-8 px-16 items-center ${isEditable && 'editable'}`}
            sx={{
                ':hover': {
                    backgroundColor: grey[200]
                },
            }}
            ref={containerRef}
        >
            <Icon className="mx-8">
                {useSvg('header' + capitalize(breakpoint.screenType) as SVG)}
            </Icon>
            <Typography className="fs-080-rem">
                {`${isEditable ? `${breakpoint.start + 1} - ` : breakpoint.text} `}
            </Typography>
            {isEditable &&
                (isBeingEdited
                    ? <Tooltip
                        PopperProps={{
                            disablePortal: true,
                        }}
                        open={!isValid}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        title={inputFeedback}
                    >
                        <OutlinedInput
                            className="fs-080-rem"
                            ref={inputRef}
                            sx={{
                                width: '100px',
                            }}
                            error={!isValid}
                            type="number"
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            defaultValue={breakpoint.end}
                            size="small"
                            endAdornment={<InputAdornment position="end">px</InputAdornment>}
                            onChange={validateInputHandler}
                            onSubmit={submitEditBreakpointHandler}
                            onKeyDown={(ev) => inputKeyDownHandler(ev.nativeEvent as KeyboardEvent)}
                            autoFocus
                        />
                    </Tooltip>
                    : <Button
                        className="start-edit-breakpoint-button fs-080-rem lowercase pa-0"
                        sx={{
                            color: 'text.primary',
                            ':hover': {
                                backgroundColor: blue[50]
                            },
                        }}
                        onClick={() => setCurrEditedBreakpointHandler(bpIdx)}
                    >{breakpoint.end + ' px'}</Button>
                )
            }
            {isEditable &&
                (isBeingEdited
                    ? <>
                        <Button
                            className="cancel-edit-button py-2 ms-auto form-control fs-070-rem"
                            onClick={discardEditHandler}
                        >Cancel</Button>
                        <Button
                            className="form-control submit-edit-button ms-8 py-2 fs-070-rem"
                            variant="contained"
                            onClick={submitEditBreakpointHandler}
                            disabled={!isValid}
                        >Done</Button>
                    </>
                    : <>
                        <IconButton
                            className="form-control start-edit-icon-button pointer cloudy-sky fill pa-0 fs-080-rem hide ms-auto me-8"
                            sx={{
                                ':hover': {
                                    fill: blue[700]
                                },
                            }}
                            onClick={() => setCurrEditedBreakpointHandler(bpIdx)}
                        >{useSvg('edit')}</IconButton>
                        <IconButton
                            className="form-control delete-breakpoint-icon-button pointer cloudy-sky fill pa-0 fs-080-rem hide"
                            sx={{
                                ':hover': {
                                    fill: blue[700]
                                },
                            }}
                            onClick={removeBreakpointHandler}
                        >{useSvg('remove')}</IconButton>
                    </>
                )
            }
        </Box>
    )
}