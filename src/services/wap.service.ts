import { PageType, Wap, WapPage, OperationStatus, Action } from "@/model/wap"
import { CSSProperties } from "react"
import { objectRecursiveUpdate } from "./util.service"
import { addBp, removeBp, updateBp } from "./wap.service.handlers/breakpoints.undo.actionLogs"
import { addSection } from "./wap.service.handlers/sections.undo.actionLogs"
import { addGridColOrRow, setGrid, updateGridLayout } from "./wap.service.handlers/containers.undo.actionLogs"

export interface UndoHandler {

}

const wapToEdit = new Wap('hi')
const pages = Object.values(wapToEdit.pages)
// wapToEdit.addSectionToPage(pages[0].id, 1,'section',true,true )
wapToEdit.addSectionToPage(pages[0].id, 0, 'section', true, true)
// wapToEdit.newPage('Home', 'Main Pages')
// wapToEdit.newPage('Work', 'Member Pages')
// wapToEdit.newPage('Buy', 'Stores')

export async function getWapToEdit(): Promise<Wap> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(wapToEdit), 1000)
    })
}

// Breakpoints
export const getRemoveBpActionLog = removeBp
export const getUpdateBpActionLog = updateBp
export const getAddBpActionLog = addBp

// Sections
export const getAddSectionActionLog = addSection

// Containers
export const getSetContainerGridActionLog = setGrid
export const getUpdateGridLayoutActionLog = updateGridLayout
export const getAddGridColOrRowActionLog = addGridColOrRow