import { Box, Button, ClickAwayListener, TextField } from "@mui/material";
import { ChangeEvent, useState } from "react";

interface CustomGridProps {
    onToggleCustomGrid: (state: boolean) => void
    onSetCustomGrid: (option: [number, number]) => void
    cols?: number
    rows?: number
}

export default function CustomGrid(props: CustomGridProps) {
    const { onToggleCustomGrid, onSetCustomGrid, cols = 1, rows = 1 } = props
    const [inputValues, setInputValues] = useState({ cols, rows })

    function inputHandler(ev: React.KeyboardEvent) {
        if (ev.key === 'Enter') return setCustomGridHandler()
        const orientation = (ev.target! as HTMLElement).getAttribute('id')!.includes('col')
            ? 'cols'
            : 'rows'
        let { value }: { value: string | number } = ev.target! as HTMLInputElement
        value = Math.max(1, parseInt(value)) || '';
        // (ev.target! as HTMLInputElement).value = '' + value
        setInputValues(values => ({
            ...values,
            [orientation]: value
        }))
    }

    function toggleCustomGridHandler(state: boolean) { onToggleCustomGrid(state) }
    function setCustomGridHandler() { onSetCustomGrid([inputValues.cols || 1, inputValues.rows || 1]) }
    return (
        <ClickAwayListener onClickAway={() => toggleCustomGridHandler(false)}>
            <Box className="custom-grid-modal flex column items-center absolute z-40 px-16 py-8 white-50 background"
                sx={{
                    color: 'text.primary',
                }}>
                <div className="flex items-center justify-between w-100 gap-12 mb-16 mt-8">
                    <label htmlFor="grid-col-input">Columns:</label>
                    <TextField
                        // onChange={inputHandler}
                        onKeyUp={inputHandler}
                        type="number"
                        data-for="cols"
                        id="grid-col-input"
                        defaultValue={inputValues.cols}
                        size="small"
                        inputProps={{ inputMode: 'numeric', pattern: '\d*' , step:1}}
                        sx={{
                            width: '70px'
                        }}
                    />
                </div>
                <div className="flex items-center justify-between w-100 gap-12 mb-16">
                    <label htmlFor="grid-row-input">Rows:</label>
                    <TextField
                        // onChange={inputHandler}
                        onKeyUp={inputHandler}
                        type="number"
                        data-for="rows"
                        id="grid-row-input"
                        defaultValue={inputValues.rows}
                        size="small"
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' , step:1}}
                        sx={{
                            width: '70px'
                        }}
                    />
                </div>
                <Button className="w-100" onClick={setCustomGridHandler}>Apply</Button>
            </Box>
        </ClickAwayListener>
    )
}

// import MiniGrid from "@/components/shared/miniGrid";
// import { Box, Button, ClickAwayListener, Tooltip, TooltipProps, Typography, styled, tooltipClasses } from "@mui/material";

// interface CustomGridProps {
//     onToggleCustomGrid: (state: boolean) => void
//     isOpen: boolean
// }

// export default function CustomGrid(props: CustomGridProps) {
//     const { onToggleCustomGrid, isOpen } = props

//     const OptionsTooltip = styled(({ className, ...props }: TooltipProps) => (
//         <Tooltip
//             disableFocusListener
//             disableHoverListener
//             disableTouchListener
//             onClose={() => toggleCustomGridHandler(false)}
//             open={isOpen}
//             {...props} classes={{ popper: className }} />))(({ theme }) => ({
//                 [`& .${tooltipClasses.tooltip}`]: {
//                     backgroundColor: 'white',
//                     color: 'text.primary',
//                     boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
//                 }
//             }))

//     function toggleCustomGridHandler(state: boolean) { onToggleCustomGrid(state) }
//     return (
//         <ClickAwayListener onClickAway={() => toggleCustomGridHandler(false)}>
//             <OptionsTooltip PopperProps={{
//                 disablePortal: true,
//             }}
//                 title={<Box className="flex column items-center">
//                     <div className="flex items-center justify-between">Columns:</div>
//                     <div className="flex items-center justify-between">Rows: </div>
//                     <Button>Apply</Button>
//                 </Box>}
//             >
//                 <Button className="auto-grid-list-item customize-grid-button w-100 justify-start gap-8"
//                     onClick={() => toggleCustomGridHandler(true)}

//                     sx={{
//                         color: 'text.primary',
//                         paddingInline: '16px',
//                     }}
//                 >
//                     <div className="mini-grid pa-4"
//                         style={{
//                             width: '30px',
//                             height: '30px',
//                             padding: '4px'
//                         }}
//                     >
//                         <MiniGrid rows={0} cols={0} custom={true} />
//                     </div>
//                     <Typography className="fw-200"
//                         sx={{
//                             textTransform: 'none'
//                         }}
//                     > Other</Typography>
//                 </Button>
//             </OptionsTooltip>
//         </ClickAwayListener>
//     )
// }