import { Box, ClickAwayListener, FormControl, InputAdornment, OutlinedInput, Tooltip, Typography } from "@mui/material";
import { useFormControlContext } from '@mui/base/FormControl'
import { useEffect, useRef, useState } from "react";
import { WapPage } from "@/model/wap";

interface ScreenWidthControllerProps {
    currScreenWidth: number
    onSetCurrScreenWidth: (width: number) => void
}

export default function ScreenWidthController(props: ScreenWidthControllerProps) {
    const { currScreenWidth, onSetCurrScreenWidth } = props
    const screenWidthInputRef = useRef<HTMLInputElement>(null)
    const [isScreenWidthValid, setIsScreenWidthValid] = useState(true)
    const [screenWidthInputFeedback, setScreenWidthFeedback] = useState('')

    function setCurrWidthHandler(width?: number) {
        const input = screenWidthInputRef.current?.childNodes[0] as HTMLInputElement
        if (!input) return
        const newWidth = width ?? +input.value
        input.blur()
        if (!validateInputHandler(newWidth) || newWidth === currScreenWidth) {
            input.value = currScreenWidth + ''
            setScreenWidthFeedback('')
            setIsScreenWidthValid(true)
            return
        }
        onSetCurrScreenWidth(newWidth)
    }

    function validateInputHandler(width: number) {
        if (width > WapPage.maxBreakpoint || width < WapPage.minBreakpoint) {
            setScreenWidthFeedback(`Breakpoints must be between ${WapPage.minBreakpoint}  px and ${WapPage.maxBreakpoint} px.`)
            setIsScreenWidthValid(false)
            return false
        }
        setScreenWidthFeedback('')
        setIsScreenWidthValid(true)
        return true
    }
    function inputKeyDownHandler(ev: KeyboardEvent) {
        const input = screenWidthInputRef.current
        if (!input) return
        if (ev.key === 'ArrowDown') input.value = +input.value - 1 + ''
        if (ev.key === 'ArrowUp') input.value = +input.value + 1 + ''
        if (ev.key === 'Enter') setCurrWidthHandler()
    }
    function screeWidthInputBlurHandler(event: Event | React.SyntheticEvent) {
        const target = ((event as Event).target as HTMLElement)
        if (target === screenWidthInputRef.current ||
            screenWidthInputRef.current?.contains(target) ||
            target.classList.contains('breakpoint-select') ||
            target.closest('.breakpoint-select')) return
        setCurrWidthHandler()
    }

    useEffect(() => {
        if (screenWidthInputRef.current) {
            const input = screenWidthInputRef.current?.childNodes[0] as HTMLInputElement
            input.value = currScreenWidth + ''
        }
    }, [screenWidthInputRef.current, currScreenWidth])

    return (
        <Box className="screen-width-control flex items-center h-100 gap-8 px-8">
            <Typography className="fs-080-rem">W</Typography>
            <ClickAwayListener onClickAway={screeWidthInputBlurHandler} >
                <Tooltip
                    PopperProps={{
                        disablePortal: true,
                    }}
                    open={!isScreenWidthValid}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    title={screenWidthInputFeedback}
                >
                    <OutlinedInput
                        className="fs-070-rem"
                        ref={screenWidthInputRef}
                        sx={{
                            width: '110px',
                        }}
                        error={!isScreenWidthValid}
                        type="number"
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        size="small"
                        endAdornment={<InputAdornment position="end">px</InputAdornment>}
                        onChange={ev => validateInputHandler(+ev.target.value)}
                        onSubmit={() => setCurrWidthHandler()}
                        onKeyDown={(ev) => inputKeyDownHandler(ev.nativeEvent as KeyboardEvent)}
                    />
                </Tooltip>
            </ClickAwayListener>
        </Box>)
}