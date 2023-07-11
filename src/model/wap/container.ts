import { formatNumber, getFormattedSegments, extractValueAndUnit } from "@/services/util.service"
import { Element } from "./element"
import { Html, OperationStatusObject, WapGridLayout, WapGridCellSize, WapGridCellSizeFormat, WapSizeUnit, WapSectionType, WapSizeMap } from "./misc"
import { WapObject } from "./wap"
import { DOMGridLayout, Orientation } from "../DOM"
import { GridCellSize } from "."


export class Container<T extends Html = 'div'> extends Element<T> {
    static defaultGridSize: WapGridCellSize = {
        value: 1, unit: 'fr',
        // minmax: {
        //     min: {
        //         value: 20,
        //         unit: '%'
        //     },
        //     max: {
        //         value: 50,
        //         unit: '%'
        //     }
        // }
    }
    protected _name = 'Container'
    protected _items: { [id: string]: Element<Html> | Container<Html> } = {}
    protected _layers: string[] = []
    // protected _gridLayout: WapGridLayout = {
    //     rows: [{
    //         ...Container.defaultGridSize,
    //         // minmax: {
    //         //     min: {
    //         //         value: 20,
    //         //         unit: '%'
    //         //     },
    //         //     max: {
    //         //         value: 50,
    //         //         unit: '%'
    //         //     }
    //         // }
    //     }],
    //     cols: [{...Container.defaultGridSize}]
    // }
    protected _grids: {
        [bp: number]: WapGridLayout
    } = {}

    constructor(tag: T, bps: number[], parentWap: WapObject, sectionId: string | null = null, parentId: string | null = null) {
        super(tag, bps, parentWap, parentId, sectionId)
        bps.forEach(bp => {
            this._grids[bp] = {
                rows: [{ ...Container.defaultGridSize }],
                cols: [{ ...Container.defaultGridSize }]
            }
            this.styles[bp] = {
                ...this.styles[bp],
                display: 'grid',
            }
        })
    }

    // Props
    get items() { return this._items }
    set items(items: { [id: string]: Element<Html> | Container<Html> }) {
        this._layers = this._layers.filter(id => items[id])
        Object.keys(items).forEach(id => {
            if (!this._layers.includes(id)) this._layers.push(id)
        })
        this._items = items
    }
    get layers() { return this._layers }
    set layers(layers: string[]) {
        this.layers = layers
        this._items = layers.reduce((items, id) => {
            items[id] = this._items[id]
            return items
        }, {} as { [id: string]: Element<Html> | Container<Html> })
    }

    // Items Methods
    addItem<P extends Html>(item: Element<P>) {
        this._items[item.id] = (item)
        this._layers.push(item.id)
    }

    // Breakpoints Methods
    addContainerBreakpoint(breakpoint: number): void {
        this.addBreakpoint(breakpoint)
        Object.values(this._items).forEach(item => {
            if (item instanceof Container) item.addContainerBreakpoint(breakpoint)
            else item.addBreakpoint(breakpoint)
        })
    }
    updateContainerBreakpoint(currVal: number, newVal: number) {
        const res = this.updateBreakpoint(currVal, newVal)
        if (!res.isUpdated) this.addBreakpoint(newVal)
        Object.values(this._items).forEach(item => {
            if (item instanceof Container) item.updateContainerBreakpoint(currVal, newVal)
            else item.updateBreakpoint(currVal, newVal)
        })
    }
    removeContainerBreakpoint(breakpoint: number): void {
        const res = this.removeBreakpoint(breakpoint)
        if (!res.isRemoved) return
        Object.values(this._items).forEach(item => {
            if (item instanceof Container) item.removeContainerBreakpoint(breakpoint)
            else item.removeBreakpoint(breakpoint)
        })
    }

    // Grid
    static translateGrideCellSizeToString(size: WapGridCellSize | WapGridCellSizeFormat): string {
        if (!Container._instanceOfGridSize(size)) return size.content
            ? size.content
            : size.value + size.unit
        else {
            if (size.minmax) return `minmax( ${Container.translateGrideCellSizeToString(size.minmax.min)}, ${this.translateGrideCellSizeToString(size.minmax.max)
                })`
            else return size.content
                ? size.content
                : size.value + size.unit
        }
    }
    static _instanceOfGridSize(object: WapGridCellSize | WapGridCellSizeFormat): object is WapGridCellSize {
        return 'minmax' in object
    }
    // getDynamicGridHeaders(props: {
    //     bp: number,
    //     croppedGrid: DOMGridLayout,
    //     croppedGridComparison: DOMGridLayout,
    //     orientation: Orientation,
    //     sizeMap: { [K in WapSizeUnit]: number }
    // }) {
    //     return Container.getFormattedGridTemplate(this._getUpdatedGridFormatDeprecated(props))
    // }
    get grid() {
        return (bp: number) => this._grids[bp]
    }
    // get gridTemplate() {
    //     return {
    //         rows: this.gridRowsLayout,
    //         cols: this.gridColsLayout
    //     }
    // }
    get sizableGridCells() {
        return (orientation: Orientation, bp: number) => this._grids[bp][orientation]
            .filter(size => !size.minmax)
            .map(size => size.value + size.unit!)
    }
    set gridRows({ gridRows, bp }: { gridRows: WapGridCellSize[], bp: number }) {
        if (!this._grids[bp]) this._grids[bp] = {
            cols: [],
            rows: []
        }
        this._grids[bp].rows = [...gridRows]
        this._grids = { ...this._grids }
        if (!this.styles[bp]) this.styles[bp] = {}
        this.styles[bp].gridTemplateRows = Container.getFormattedGridTemplate(gridRows).join(' ')
    }
    set gridCols({ bp, gridCols }: { bp: number, gridCols: WapGridCellSize[] }) {
        if (!this._grids[bp]) this._grids[bp] = {
            cols: [],
            rows: []
        }
        this._grids[bp].cols = [...gridCols]
        this._grids = { ...this._grids }
        if (!this.styles[bp]) this.styles[bp] = {}
        this.styles[bp].gridTemplateColumns = Container.getFormattedGridTemplate(gridCols).join(' ')
    }
    get gridColsLayout() {
        return (bp: number) => {
            // debugger
            const lastBpIdx = Math.min(...Object.keys(this._grids).map(k => +k))
            return this._grids[bp]?.cols || this._grids[lastBpIdx]!.cols!
        }
    }
    get gridTemplateCols() { return (bp: number) => Container.getFormattedGridTemplate(this.gridColsLayout(bp)) }
    get gridRowsLayout() {
        return (bp: number) => {
            // debugger
            const lastBpIdx = Math.min(...Object.keys(this._grids).map(k => +k))
            return this._grids[bp]?.rows || this._grids[lastBpIdx]!.rows!
        }
    }
    get gridTemplateRows() { return (bp: number) => Container.getFormattedGridTemplate(this.gridRowsLayout(bp)) }
    protected _getUpdatedGridFormatDeprecated(props:
        {
            croppedGrid: DOMGridLayout,
            croppedGridComparison: DOMGridLayout,
            orientation: Orientation,
            sizeMap: { [K in WapSizeUnit]: number },
            bp: number
        }) {
        const { bp, sizeMap, croppedGrid, croppedGridComparison, orientation } = props
        const containerGridValues = orientation === 'cols'
            ? this.grid(bp).cols
            : this.grid(bp).rows
        const modifiedSizes = orientation === 'cols'
            ? croppedGrid.colSizes
            : croppedGrid.rowSizes
        const comparisonSizes = orientation === 'cols'
            ? croppedGridComparison.colSizes
            : croppedGridComparison.rowSizes
        const idxs = orientation === 'cols'
            ? croppedGrid.colIdxs
            : croppedGrid.rowIdxs
        const template: WapGridCellSize[] = []
        for (let i = 0; i < modifiedSizes.length; i++) {
            const diff = modifiedSizes[i] - comparisonSizes[i]

            if (!diff) {
                template.push({ ...containerGridValues[i] })
                continue
            }
            const globalIdx = i + idxs[0]
            const currSize = containerGridValues[globalIdx]
            if (currSize.minmax) {
                const prevDiff = i > 0
                    ? modifiedSizes[i - 1] - comparisonSizes[i - 1]
                    : 0
                if (globalIdx === 0 || !prevDiff) {
                    const { unit, value } = currSize.minmax.max
                    console.log(diff)
                    const newVal = value + (diff / sizeMap[unit])
                    template.push({
                        ...containerGridValues[i],
                        minmax: {
                            ...currSize.minmax,
                            max: {
                                value: newVal,
                                unit
                            }
                        }
                    })
                    continue
                }
                if (globalIdx === containerGridValues.length - 1 || prevDiff) {
                    const { unit, value } = currSize.minmax.min
                    const newVal = value + (diff / sizeMap[unit])
                    template.push({
                        ...containerGridValues[i],
                        minmax: {
                            ...currSize.minmax,
                            min: {
                                value: newVal,
                                unit
                            }
                        }
                    })

                    continue
                }
            } else {
                const { unit, value } = currSize
                const newVal = value + (diff / sizeMap[unit])
                if (newVal <= 0) continue
                template.push({
                    ...containerGridValues[i],
                    value: formatNumber(newVal)
                })
            }
        }
        // console.log(containerGridValues)
        return template
    }
    getUpdatedGridFormat(props:
        {
            originalGrid: number[],
            modifiedGrid: number[],
            orientation: Orientation,
            sizeMap: WapSizeMap,
            bp: number
        }) {
        const { originalGrid, modifiedGrid, orientation, sizeMap, bp } = props
        const currGrid = this.grid(bp)[orientation]
        const newTemplate: GridCellSize[] = []
        for (let i = 0; i < currGrid.length; i++) {
            const diff = modifiedGrid[i] - originalGrid[i]
            const currSize = currGrid[i]

            if (!diff) {
                newTemplate.push({ ...currSize })
                continue
            }

            const { unit, value } = currSize
            const newVal = value + (diff / sizeMap[unit])
            if (newVal <= 0) {
                if (newVal < 0) console.log('fuck my face')
                continue
            }
            newTemplate.push({
                ...currSize,
                value: newVal
            })
        }
        return newTemplate
    }
    // getUpdatedGridFormatGama(props:
    //     {
    //         originalGrid: WapGridCellSize[],
    //         modifiedGrid: WapGridCellSize[],
    //         orientation: Orientation,
    //         sizeMap: WapSizeMap,
    //         bp: number
    //     }) {
    //     const { originalGrid, modifiedGrid, orientation, sizeMap, bp } = props
    //     const currGrid = this.grid(bp)[orientation]
    //     const newTemplate: GridCellSize[] = []
    //     for (let i = 0; i < currGrid.length; i++) {
    //         const diff = modifiedGrid[i].value - originalGrid[i].value
    //         const currSize = currGrid[i]

    //         if (!diff) {
    //             newTemplate.push({ ...currSize })
    //             continue
    //         }

    //         const { unit, value } = currSize
    //         const newVal = value + (diff / sizeMap[unit])
    //         if (newVal <= 0) {
    //             if (newVal < 0) console.log('fuck my face')
    //             continue
    //         }
    //         newTemplate.push({
    //             ...currSize,
    //             value: newVal
    //         })
    //     }
    //     return newTemplate
    // }
    static getFormattedGridTemplate(cells: WapGridCellSize[]) {
        return cells.length
            ? cells.map(cell => Container.translateGrideCellSizeToString(cell))
            : ['1fr']
    }
    dragNewGridDivider(orientation: Orientation, bp: number, containerWidth: number, dividerPos: number, segments?: WapGridCellSize[]): OperationStatusObject<'isAdded', WapGridCellSize[]> {
        const res = getFormattedSegments(containerWidth, segments || this._grids[bp][orientation], dividerPos)
        return res
    }
    updateGrid(props: {
        bp: number,
        croppedGrid: DOMGridLayout,
        croppedGridComparison: DOMGridLayout,
        orientation: Orientation,
        sizeMap: { [K in WapSizeUnit]: number }
    }) {
        const template = this._getUpdatedGridFormatDeprecated(props)
        const { bp, orientation } = props
        if (orientation === 'cols') this.gridCols = { bp, gridCols: template }
        else this.gridRows = { bp, gridRows: template }
        // this._gridLayout = {...this._gridLayout}
        return template
    }
    updateGridBeta(props: {
        originalGrid: number[],
        modifiedGrid: number[],
        orientation: Orientation,
        sizeMap: WapSizeMap,
        bp: number
    }) {
        // debugger
        const newTemplate = this.getUpdatedGridFormat(props)
        const { bp, orientation } = props
        if (orientation === 'cols') this.gridCols = { bp, gridCols: newTemplate }
        else this.gridRows = { bp, gridRows: newTemplate }
        return newTemplate
    }
    editGrid(orientation: Orientation, bp: number, idx: number, size: WapGridCellSize): OperationStatusObject<'isUpdated', WapGridCellSize[]> {
        if (idx < 0 || idx >= this._grids[bp][orientation].length || !this._grids[bp][orientation][idx]) return {
            isUpdated: false,
            status: 'warning',
            message: 'Divider index out of grid array'
        }
        this._grids[bp][orientation].splice(idx, 1, size)
        const newTemplate = Container.getFormattedGridTemplate(this._grids[bp][orientation]).join(' ')
        if (orientation === 'cols') this.globalStyles.gridTemplateColumns = newTemplate
        else this.globalStyles.gridTemplateRows = newTemplate
        return {
            isUpdated: true,
            status: 'success',
            payload: this._grids[bp][orientation]
        }
    }
    removeDivider(orientation: Orientation, bp: number, idx: number): OperationStatusObject<'isRemoved', WapGridCellSize[]> {
        if (idx < 0 || idx >= this._grids[bp][orientation].length || !this._grids[bp][orientation][idx]) return {
            isRemoved: false,
            status: 'warning',
            message: 'Divider index out of grid array'
        }
        this._grids[bp][orientation].splice(idx, 1)
        if (this._grids[bp][orientation].length <= 1) this._grids[bp][orientation] = []
        const newTemplate = Container.getFormattedGridTemplate(this._grids[bp][orientation]).join(' ')
        if (orientation === 'cols') this.globalStyles.gridTemplateColumns = newTemplate
        else this.globalStyles.gridTemplateRows = newTemplate
        return {
            isRemoved: true,
            status: 'success',
            payload: this._grids[bp][orientation]
        }
    }
    addNewDivider(orientation: Orientation, bp: number, idx: number) {
        const { defaultGridSize } = Container
        if (this._grids[bp][orientation].length) this._grids[bp][orientation].splice(idx, 0, defaultGridSize)
        else this._grids[bp][orientation].push(defaultGridSize, defaultGridSize)
        const newTemplate = Container.getFormattedGridTemplate(this._grids[bp][orientation]).join(' ')
        if (orientation === 'cols') this.globalStyles.gridTemplateColumns = newTemplate
        else this.globalStyles.gridTemplateRows = newTemplate
        return this.gridRows
    }
}