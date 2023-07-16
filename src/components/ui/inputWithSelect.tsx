import { ElSizeOptions } from "@/model/wap"
import { Avatar, Box, IconButton, Input, InputLabel, SxProps, Theme, Tooltip } from "@mui/material"
import { CSSProperties, HTMLInputTypeAttribute } from "react"

interface InputWithSelectProps {
    label: string
    disabled?: boolean
    onInput?: (ev: React.ChangeEvent) => void
    inputType?: HTMLInputTypeAttribute
    containerStyles?: SxProps<Theme>
    inputContainerStyles?: SxProps<Theme>
    inputStyles?: CSSProperties
    labelStyles?: CSSProperties
    tooltipStyles?: SxProps<Theme>
    selectButtonStyles?: CSSProperties
    tooltipText?: string
    onSelectClick: (event: React.MouseEvent<HTMLElement>) => void
    open: boolean
    id: ElSizeOptions
    selectButtonText: string
    defaultValue?: string
    tooltipPlacement?: "bottom" | "left" | "right" | "top" | "bottom-end" | "bottom-start" | "left-end" | "left-start" | "right-end" | "right-start" | "top-end" | "top-start"
}

export default function InputWithSelect(props: InputWithSelectProps) {
    const { onInput, label, tooltipPlacement = 'top', tooltipStyles = {}, tooltipText = '', onSelectClick, open, id, selectButtonText, disabled = false, containerStyles = {}, inputContainerStyles = {}, inputStyles = {}, selectButtonStyles = {}, labelStyles = {}, inputType = 'text', defaultValue = '' } = props

    function inputHandler(ev: React.ChangeEvent) { if (onInput) onInput(ev) }

    return (
        <Tooltip title={tooltipText} placement={tooltipPlacement} PopperProps={{
            sx: tooltipStyles
        }}>
            <Box className="input-with-select-container flex items-center justify-between gap-4 w-100" sx={containerStyles}>
                <label style={labelStyles}>{label}</label>
                <Box className={`input-container flex pa-4 items-center ${disabled && 'white-100-background'}`} sx={inputContainerStyles}>
                    {!disabled && <input
                        id={id + '-input'}
                        onChange={inputHandler}
                        type={inputType}
                        style={inputStyles}
                        disabled={disabled}
                        value={defaultValue} />}
                    <span
                        className={`${!disabled ? 'blue-A700 pointer' : 'white-500 events-none'}`}
                        id={id}
                        onClick={onSelectClick}
                        aria-controls={open ? id + '-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        style={selectButtonStyles}
                    >{selectButtonText}</span>
                </Box>

            </Box>
            {/* <InputLabel >
                <span className="fs-10-px w-min of-hidden">{label}</span>
                <Input
                    inputProps={{ 'aria-label': label }}
                    endAdornment={
                        <span>{selectButton}</span>
                    }
                />
            </InputLabel> */}
        </Tooltip>
    )
}