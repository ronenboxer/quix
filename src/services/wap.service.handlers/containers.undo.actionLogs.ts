import { DOMGridLayout, Orientation } from "@/model/DOM";
import { GridLayout, OperationStatus, SectionType, SizeMap, WapContainerEl, WapSection } from "@/model/wap";
import { WapAction, WapGridCellSize, WapSizeUnit } from "@/model/wap/misc";

export function setGrid(container: WapContainerEl | WapSection<SectionType>, grid: GridLayout, bp: number):
    OperationStatus<'isSet', WapAction> {
    // debugger
    const currGrid: GridLayout = JSON.parse(JSON.stringify(container.grid(bp)))
    const action = () => {
        container.gridCols = { bp, gridCols: currGrid.cols }
        container.gridRows = { bp, gridRows: currGrid.rows }
    }
    container.gridCols = { bp, gridCols: grid.cols }
    container.gridRows = { bp, gridRows: grid.rows }

    const newGrid: GridLayout = JSON.parse(JSON.stringify(grid))
    const counterAction = () => {
        container.gridCols = { bp, gridCols: newGrid.cols }
        container.gridRows = { bp, gridRows: newGrid.rows }
    }

    return {
        isSet: true,
        status: 'success',
        message: `Curr grid template is ${container.gridTemplateCols(bp).length} x ${container.gridTemplateRows(bp).length}`,
        payload: { action, counterAction }
    }
}

export function updateGridLayoutDeprecated(props: {
    container: WapContainerEl | WapSection<SectionType>
    bp: number,
    sizeMap: { [K in WapSizeUnit]: number },
    orientation: Orientation,
    croppedGrid: DOMGridLayout,
    croppedGridComparison: DOMGridLayout
}): OperationStatus<'isUpdated', WapAction> {
    const { container, bp, sizeMap, orientation, croppedGridComparison, croppedGrid } = props
    const currLayout: WapGridCellSize[] = JSON.parse(JSON.stringify(container.grid(bp)[orientation]))
    container.updateGrid({
        bp,
        orientation,
        sizeMap,
        croppedGrid,
        croppedGridComparison,
    })
    const updatedLayout: WapGridCellSize[] = JSON.parse(JSON.stringify(container.grid(bp)[orientation]))
    const action = orientation === 'cols'
        ? () => container.gridCols = { bp, gridCols: currLayout }
        : () => container.gridRows = { bp, gridRows: currLayout }
    const counterAction = orientation === 'cols'
        ? () => container.gridCols = { bp, gridCols: updatedLayout }
        : () => container.gridRows = { bp, gridRows: updatedLayout }
    return {
        isUpdated: true,
        status: 'success',
        payload: { action, counterAction }
    }
}

export function updateGridLayout(props: {
    container: WapContainerEl | WapSection<SectionType>
    orientation: Orientation,
    gridLayout: WapGridCellSize[],
    bp: number
}) {
    const { gridLayout, container, orientation, bp } = props
    const currLayout: WapGridCellSize[] = JSON.parse(JSON.stringify(container.grid(bp)[orientation]))
    const updatedLayout: WapGridCellSize[] = JSON.parse(JSON.stringify(gridLayout))
    const action = orientation === 'cols'
        ? () => container.gridCols = { bp, gridCols: currLayout }
        : () => container.gridRows = { bp, gridRows: currLayout }
    const counterAction = orientation === 'cols'
        ? () => container.gridCols = { bp, gridCols: updatedLayout }
        : () => container.gridRows = { bp, gridRows: updatedLayout }
    counterAction()
    return {
        isUpdated: true,
        status: 'success',
        payload: { action, counterAction }
    }

}