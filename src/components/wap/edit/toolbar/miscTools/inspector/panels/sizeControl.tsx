import InputWithSelect from "@/components/ui/inputWithSelect"
import { ElSizeOptions, ElSizeUnit, GridLayout, HtmlContainerTags, HtmlTags, PageType, SectionType, WapContainerEl, WapElement, WapPage, WapSection } from "@/model/wap"
import { WapElSizeOptions, WapElSizeUnit } from "@/model/wap/misc"
import { extractContainerValueAndUnit } from "@/services/util.service"
import { Logout, PersonAdd, Settings } from "@mui/icons-material"
import { Avatar, Box, Button, Divider, Input, ListItemIcon, Menu, MenuItem, Select } from "@mui/material"
import { blue } from "@mui/material/colors"
import { useEffect, useState } from "react"

interface SizeControlProps <T extends WapElement<HtmlTags>>{
    onSetGridLayout: <K extends WapContainerEl<HtmlContainerTags>>(cont: K, grid: GridLayout) => void
    element: T 
    isWidthSizable?: boolean
    isHeightSizable?: boolean
    bp: number
}

export default function SizeControl<T extends WapElement<HtmlTags>>(props: SizeControlProps<T>) {
    const { onSetGridLayout, element, isHeightSizable = true, isWidthSizable = true, bp } = props
    const [sizeMenuAnchorEl, setSizeMenuAnchorEl] = useState<null | {
        el: HTMLElement
        id: ElSizeOptions
    }>(null)
    const [elementSizes, setElementsSizes] = useState<{ [T in ElSizeOptions]: { unit: ElSizeUnit, size: number | '' } }>(getElementSizes())
    const unitMap: { [T in ElSizeUnit]: string } = {
        px: 'Pixels (px)',
        none: 'None',
        vw: 'Viewport width (vw)',
        vh: 'Viewport height (vh)',
        '%': 'Percentage (%)',
        'max-c': 'Max content (max-c)',
        'fit-c': 'Fit content (fit-c)',
        'min-c': 'Min content (min-c)',
        auto: 'Auto',
        unset: 'Unset',
        inherit: 'Inherit'
    }
    const menus: { [T in ElSizeOptions]: ElSizeUnit[] } = {
        width: ['px', 'vh', 'vw', 'max-c', 'min-c'],
        'min-width': ['px', '%', 'vh', 'vw', 'max-c', 'min-c', 'none'],
        'max-width': ['px', '%', 'vh', 'vw', 'max-c', 'min-c', 'none'],
        height: ['px', 'vh', 'vw', 'max-c', 'min-c'],
        'min-height': ['px', '%', 'vh', 'vw', 'max-c', 'min-c', 'none'],
        'max-height': ['px', '%', 'vh', 'vw', 'max-c', 'min-c', 'none'],
    }
    const labelMap: { id: ElSizeOptions, label: string }[] = [
        { id: 'width', label: 'Width' },
        { id: 'height', label: 'Height' },
        { id: 'min-width', label: 'Min W' },
        { id: 'min-height', label: 'Min H' },
        { id: 'max-width', label: 'Max W' },
        { id: 'max-height', label: 'Max H' },
    ]

    function selectSizeMenuHandler(ev: React.MouseEvent<HTMLElement>) {
        setSizeMenuAnchorEl({
            el: ev.currentTarget,
            id: ev.currentTarget.id as ElSizeOptions
        })
    }
    function handleClose() { setSizeMenuAnchorEl(null) }
    function selectUnit(props: { size: ElSizeOptions, unit: ElSizeUnit }) {
        const { size, unit } = props
        setElementsSizes(sizes => ({ ...sizes, [size]: { ...sizes[size], unit } }))
        handleClose()
    }

    function containerGridLayoutHandler<K extends WapContainerEl<HtmlContainerTags>>(cont: K, grid: GridLayout) { onSetGridLayout(cont, grid) }
    function getElementSizes() {
        const elStyles = element.styles[bp] || {}
        const sizes: { [T in ElSizeOptions]: { unit: ElSizeUnit, size: number | '' } } = {
            width: element.name === 'Section'
                ? { size: '', unit: 'auto' }
                : extractContainerValueAndUnit('' + (elStyles.width || '100%')),
            'max-width': element.name === 'Section'
                ? { size: '', unit: 'auto' }
                : extractContainerValueAndUnit('' + (elStyles.maxWidth || 'none')),
            'min-width': element.name === 'Section'
                ? { size: '', unit: 'auto' }
                : extractContainerValueAndUnit('' + (elStyles.minWidth || 'none')),
            height: element.name === 'Vertical Section'
                ? { size: '', unit: 'auto' }
                : extractContainerValueAndUnit('' + (elStyles.height || '100%')),
            'max-height': element.name === 'Vertical Section'
                ? { size: '', unit: 'auto' }
                : extractContainerValueAndUnit('' + (elStyles.maxHeight || 'none')),
            'min-height': element.name === 'Vertical Section'
                ? { size: '', unit: 'auto' }
                : extractContainerValueAndUnit('' + (elStyles.minHeight || 'none'))
        }
        return sizes
    }

    function getToolTip({ id, unit }: { id: WapElSizeOptions, unit: WapElSizeUnit }) {
        if (id.includes('width') && element.name === 'Section') return 'Section width is always set to Auto'
        if (id.includes('height') && element.name === 'Vertical Section') return 'Vertical section height is always set to Auto'
        return unit === 'auto'
            ? `Section ${id.includes('width') ? 'width' : 'height'} is set to Auto`
            : ''
    }

    function getInputList() {
        return (labelMap.map(({ id, label }, idx) => (<InputWithSelect
            tooltipText={getToolTip({ id, unit: elementSizes[id].unit })}
            tooltipPlacement="top"
            tooltipStyles={{
                zIndex: '50000',
                '.MuiTooltip-tooltip': {
                    paddingBlock: '16px',
                    background: 'white',
                    color: '#333',
                    fontWeight: '200',
                    boxShadow: `rgba(0, 0, 0, 0.2) 0px 12px 28px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset`
                }
            }}
            key={id}
            defaultValue={elementSizes[id].unit === 'auto'
                ? 'Auto'
                : elementSizes[id].unit === 'none'
                    ? ''
                    : '' + elementSizes[id].size}
            disabled={elementSizes[id].unit === 'auto'}
            onInput={inputHandler}
            containerStyles={{
                gap: '4px',
            }}
            inputContainerStyles={{
                ...(idx % 2
                    ? {}
                    : { marginInlineEnd: '4px' }),
                '&:has(input:focus)': {
                    borderColor: blue['A700']
                },
                width: '70px',
                borderRadius: '4px',
            }}
            labelStyles={{
                flexGrow: '2',
                fontSize: '10px',
                ...(idx % 2
                    ? { marginInlineStart: '4px' }
                    : {})
            }}
            inputType="number"
            inputStyles={{
                flexShrink: '1',
                fontSize: '10px',
                margin: '1px',
                width: '25px',
                border: 'none',
                outline: 'none',
                display: elementSizes[id].unit === 'none'
                    ? 'none'
                    : 'inline-block'
            }}
            selectButtonStyles={{
                width: '35px',
                textAlign: 'right',
                flexGrow: '3',
                fontSize: '10px'
            }}
            open={!!sizeMenuAnchorEl}
            onSelectClick={selectSizeMenuHandler}
            id={id}
            label={label}
            selectButtonText={elementSizes[id].unit === 'auto' ? 'Auto' : elementSizes[id].unit} />)))

    }

    function getMenuList() {
        if (!sizeMenuAnchorEl?.el) return null
        return menus[sizeMenuAnchorEl.id].map(unit => (<MenuItem
            key={unit}
            className={`fw-100 ${elementSizes[sizeMenuAnchorEl.id].unit === unit && 'blue-50-background blue-A700'}`}
            onClick={() => selectUnit({ size: sizeMenuAnchorEl.id, unit })}>{unitMap[unit]}</MenuItem>))
    }

    function inputHandler(ev: React.ChangeEvent) {
        const inputEl = ev.currentTarget! as HTMLInputElement
        const id: ElSizeOptions = (inputEl.id.replace('-input', '')) as ElSizeOptions
        let { value }: { value: string } = inputEl
        console.log(value)
        if (isNaN(+value) && value !== '' || value.includes('e')) return
        if (+value <= 0 && value !== '') value = elementSizes[id as ElSizeOptions].size + ''
        setElementsSizes(sizes => ({ ...sizes, [id]: { ...sizes[id], size: value === '' ? '' : +value } }))
    }
    // const [sizeOption, setSizeOption] = useState<'fixed' | 'fluid'>('fixed')

    // function sizeOptionsHandler(option: 'fixed' | 'fluid') { setSizeOption(option) }

    useEffect(() => {
        setElementsSizes(getElementSizes())
    }, [element])

    return (
        <Box className="pa-0 w-100">
            <span className="fs-12-px">Sizing options</span>
            <Box
                component="form"
                className="grid w-100 mt-16 gap-8"
                sx={{
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gridTemplateRows: 'repeat(3, 1fr)'
                }}>
                {getInputList()}
            </Box>
            <Menu
                anchorEl={sizeMenuAnchorEl?.el}
                id="size-menu"
                open={!!sizeMenuAnchorEl}
                onClose={handleClose}
                onClick={handleClose}
                sx={{
                    zIndex: 50000,
                }}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        zIndex: 20000,
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                MenuListProps={{
                    sx: {
                        paddingBlock: '0'
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {getMenuList()}
            </Menu>
            {/* <div className="size-option-buttons flex mt-32 mb-16">
                <Button
                    onClick={() => sizeOptionsHandler('fixed')}
                    className={`capitalize flex w-50 ma-0 py-4 fw-100 center ${sizeOption === 'fixed' && 'selected'}`} sx={{
                        '&:hover': {
                            color: blue['A700']
                        },
                        color: '#333'
                    }}>
                    <span>Fixed</span>
                </Button>
                <Button
                    onClick={() => sizeOptionsHandler('fluid')}
                    className={`capitalize flex w-50 ma-0 py-4 fw-100 center ${sizeOption === 'fluid' && 'selected'}`} sx={{
                        '&:hover': {
                            color: blue['A700']
                        },
                        color: '#333'
                    }}>
                    <span>Fluid</span>
                </Button>
            </div> */}
        </Box >
    )
}