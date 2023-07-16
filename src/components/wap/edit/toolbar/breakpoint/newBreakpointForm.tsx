import { SVG, useSvg } from "@/components/shared/useSvg"
import { OperationStatus, WapPage } from "@/model/wap"
import { capitalize } from "@/services/util.service"
import { Box, Button, Icon, InputAdornment, OutlinedInput, Tooltip } from "@mui/material"
import { ChangeEvent, useEffect, useRef, useState } from "react"

interface EditBreakpointFormProps {
    breakpoint: number
    onNewBreakpointSubmit: (newVal: number) => OperationStatus<"isAdded", number>
    onNewBreakpointInput: (newVal: number) => OperationStatus<"isAvailable", number>
    onSetCurrEditedBreakpoint: (idx?: number) => void
}

export default function NewBreakpointForm(props: EditBreakpointFormProps) {
    const { breakpoint, onNewBreakpointInput, onNewBreakpointSubmit, onSetCurrEditedBreakpoint } = props
    const [inputFeedback, setInputFeedback] = useState<string | null>(null)
    const [isValid, setIsValid] = useState(true)
    const [newVal, setNewVal] = useState<number>(breakpoint)
    const isEditable = true
    const inputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    function discardEditHandler() {
        onSetCurrEditedBreakpoint()
    }

    function inputKeyDownHandler(ev: KeyboardEvent) {
        if (ev.key === 'Enter') return isValid && submitNewBreakpointHandler()
        if (ev.key === 'ArrowUp') return setNewVal(val => val + 1)
        if (ev.key === 'ArrowDown') return setNewVal(val => val - 1)
    }

    function validateInputHandler(ev: ChangeEvent<HTMLInputElement>) {
        const val = +ev.target.value
        const res = onNewBreakpointInput(val)
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

    function submitNewBreakpointHandler() {
        const res = onNewBreakpointInput(newVal)
        if (res.isAvailable) return onNewBreakpointSubmit(newVal)
        handleInputFeedback(res.message?.toString())
    }

    useEffect(() => {
        const isDefaultValueValid = onNewBreakpointInput(breakpoint)
        handleInputFeedback(isDefaultValueValid.message?.toString())
    }, [])

    return (
        <Box
            className={`new-breakpoint-form flex ${isEditable && 'editable'} py-8 px-16 items-center`}
            ref={containerRef}
        >
            <Icon className="mx-8">
                {useSvg('header' + capitalize(WapPage.screenType(newVal)) as SVG)}
            </Icon>
            <Tooltip
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
                    ref={inputRef}
                    className="breakpoint-input fs-080-rem"
                    sx={{
                        width: '100px',
                    }}
                    error={!isValid}
                    type="number"
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    defaultValue={newVal}
                    size="small"
                    endAdornment={<InputAdornment position="end">px</InputAdornment>}
                    onChange={validateInputHandler}
                    onSubmit={submitNewBreakpointHandler}
                    onKeyDown={(ev) => inputKeyDownHandler(ev.nativeEvent as KeyboardEvent)}
                    autoFocus
                />
            </Tooltip>
            <Button
                className="form-control cancel-new-breakpoint-button py-2 fs-070-rem ms-auto"
                onClick={discardEditHandler}
            >Cancel</Button>
            <Button
                className="form-control submit-new-breakpoint-button ms-8 py-2 fs-070-rem"
                variant="contained"
                onClick={submitNewBreakpointHandler}
                disabled={!isValid}
            >Done</Button>
        </Box>
    )
}