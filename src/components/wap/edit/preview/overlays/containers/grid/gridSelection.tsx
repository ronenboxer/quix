import MiniGrid from "@/components/shared/miniGrid";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import { useEffect, useState } from "react";
import CustomGrid from "./customGrid";

interface GridSelectionProps {
    gridOptions: [number, number][]
    currOption: number
    onSetCurrOption: (idx: number) => void
    onToggleCustomGrid: (state: boolean) => void
}

export default function GridSelection(props: GridSelectionProps) {
    const { gridOptions, currOption, onSetCurrOption, onToggleCustomGrid } = props

    function toggleCustomGridHandler(state: boolean) { onToggleCustomGrid(state) }

    function getGridSelectItems() {
        return gridOptions.map((option, idx) =>
            <MenuItem
                className="auto-grid-list-item"
                key={`grid-select-${option[0]}-${option[1]}`}
                value={'' + idx}>
                <Box
                    className="flex items-center gap-8"
                    sx={{
                        width: '120px',
                        color: idx === currOption
                            ? blue['A700']
                            : 'text.primary',
                    }}>

                    <div className="mini-grid pa-4"
                        style={{
                            width: '32px',
                            height: '32px',
                            padding: '4px'
                        }}
                    >
                        <MiniGrid
                            isSelected={idx === currOption}
                            styles={{
                                // borderColor: idx === currOption
                                //     ? blue['A700']
                                //     : 'text.primary'
                            }} rows={option[1]} cols={option[0]} />
                    </div>
                    <Typography
                        className="fw-200"
                        sx={{
                            color: idx === currOption ? blue['A700'] : 'text.primary'
                        }}>
                        {`${option[0]} x ${option[1]}`}
                    </Typography>
                </Box>
            </MenuItem>)
    }

    function selectGridOptionHandler(event: SelectChangeEvent) {
        if (isNaN(+event.target.value)) return
        onSetCurrOption(+event.target.value)
    }

    useEffect(() => {

    }, [])

    return (
        <FormControl sx={{ minWidth: 120 }} size="small" className="grid-select-form pa-4">
            <InputLabel id="section-grid-select-label">Grid</InputLabel>
            <Select
                className="auto-grid-template-selection flex of-y-auto"
                labelId="section-grid-select-label"
                id="section-grid-select"
                value={'' + currOption}
                label="Grid"
                onChange={selectGridOptionHandler}
                MenuProps={{
                    style: {
                        maxHeight: '176px',
                        // overflowY: 'auto'
                    }
                }}
            >
                {getGridSelectItems()}
                <Button className="auto-grid-list-item customize-grid-button w-100 justify-start gap-8"
                    onClick={() => toggleCustomGridHandler(true)}

                    sx={{
                        color: 'text.primary',
                        paddingInline: '16px',
                    }}
                >
                    <div className="mini-grid pa-4"
                        style={{
                            width: '32px',
                            height: '32px',
                            padding: '4px'
                        }}
                    >
                        <MiniGrid rows={0} cols={0} custom={true} />
                    </div>
                    <Typography className="fw-200"
                        sx={{
                            textTransform: 'none'
                        }}
                    > Other</Typography>
                </Button>
            </Select>
        </FormControl>
    )
}