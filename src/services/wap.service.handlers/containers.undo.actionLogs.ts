import { DOMGridLayout, Orientation } from "@/model/DOM"
import { GridLayout, OperationStatus, WapContainerEl, HtmlContainerTags } from "@/model/wap"
import { WapAction, WapGridCellSize, WapGridSizeUnit } from "@/model/wap/misc"

export function setGrid<T extends WapContainerEl<HtmlContainerTags>>(container: T, grid: GridLayout, bp: number):
    OperationStatus<'isSet', WapAction> {
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
        message: `Curr grid template is ${container.gridTemplateCols(bp).length} X ${container.gridTemplateRows(bp).length}`,
        payload: { action, counterAction }
    }
}

// export function updateGridLayoutDeprecated<T extends WapContainerEl<HtmlContainerTags>>(props: {
//     container: T
//     bp: number,
//     sizeMap: { [K in WapGridSizeUnit]: number },
//     orientation: Orientation,
//     croppedGrid: DOMGridLayout,
//     croppedGridComparison: DOMGridLayout
// }): OperationStatus<'isUpdated', WapAction> {
//     const { container, bp, sizeMap, orientation, croppedGridComparison, croppedGrid } = props
//     const currLayout: WapGridCellSize[] = JSON.parse(JSON.stringify(container.grid(bp)[orientation]))
//     container.updateGrid({
//         bp,
//         orientation,
//         sizeMap,
//         croppedGrid,
//         croppedGridComparison,
//     })
//     const updatedLayout: WapGridCellSize[] = JSON.parse(JSON.stringify(container.grid(bp)[orientation]))
//     const action = orientation === 'cols'
//         ? () => container.gridCols = { bp, gridCols: currLayout }
//         : () => container.gridRows = { bp, gridRows: currLayout }
//     const counterAction = orientation === 'cols'
//         ? () => container.gridCols = { bp, gridCols: updatedLayout }
//         : () => container.gridRows = { bp, gridRows: updatedLayout }
//     return {
//         isUpdated: true,
//         status: 'success',
//         payload: { action, counterAction }
//     }
// }

export function updateGridLayout<T extends WapContainerEl<HtmlContainerTags>>(props: {
    container: T
    orientation: Orientation,
    gridLayout: WapGridCellSize[],
    bp: number
}) :OperationStatus<'isUpdated', WapAction>{
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

export function addGridColOrRow<T extends WapContainerEl<HtmlContainerTags>>(props: {
    container: T,
    bp: number,
    orientation: Orientation,
    idx: number
}): OperationStatus<'isAdded', WapAction> {
    const { container, bp, orientation, idx } = props
    const currLayout: WapGridCellSize[] = JSON.parse(JSON.stringify(container.grid(bp)[orientation]))
    const res = container.addGridTemplate(bp, orientation, idx)
    if (!res.isAdded) return { ...res, payload: undefined }
    const updatedLayout: WapGridCellSize[] = JSON.parse(JSON.stringify(res.payload!))
    const action = () => container.gridLayout = { bp, orientation, layout: currLayout }
    const counterAction = () => container.gridLayout = { bp, orientation, layout: updatedLayout }
    return {
        ...res,
        isAdded: true,
        status: 'success',
        payload: { action, counterAction }
    }
}