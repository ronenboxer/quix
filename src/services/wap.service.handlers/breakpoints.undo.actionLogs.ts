import { Wap, WapPage, PageType, OperationStatus, ActionLogs } from "@/model/wap"
import { WapAction } from "@/model/wap/misc"
import { CSSProperties } from "react"
import { objectRecursiveUpdate } from "../util.service"

export function removeBp(wap: Wap, page: WapPage<PageType>, bpIdx: number): OperationStatus<'isRemoved', WapAction> {
    const bp = page.breakpoints[bpIdx]
    const undoMap: {
        pages: {
            [id: string]: {
                breakpoints: number[]
            }
        },
        sections: {
            [id: string]: {
                styles: {
                    [bp: number]: CSSProperties
                }
            }
        }
    } = {
        pages: {
            [page.id]: {
                breakpoints: [...page.breakpoints]
            }
        },
        sections: {}
    }
    Object.values(wap.sections).forEach(section => {
        undoMap.sections[section.id] = {
            styles: { [bp]: section.styles[bp] }
        }
    })

    const res = page.removeBreakpoint(bpIdx)
    if (res.isRemoved) {
        const redoMap: {
            pages: {
                [id: string]: {
                    breakpoints: number[]
                }
            },
            sections: {
                [id: string]: {
                    styles: {
                        [bp: number]: CSSProperties | undefined
                    }
                }
            }
        } = {
            pages: {
                [page.id]: {
                    breakpoints: [...page.breakpoints]
                }
            },
            sections: {}
        }
        Object.values(wap.sections).forEach(section => {
            redoMap.sections[section.id] = {
                styles: { [bp]: undefined }
            }
        })
        const action = objectRecursiveUpdate.bind(null, wap, undoMap)
        const counterAction = objectRecursiveUpdate.bind(null, wap, redoMap)
        return { ...res, payload: { action, counterAction } }
    }
    return { ...res, payload: undefined }
}

export function updateBp(wap: Wap, page: WapPage<PageType>, bpIdx: number, newBp: number): OperationStatus<'isUpdated', WapAction> {
    const bp = page.breakpoints[bpIdx]
    const undoMap: {
        pages: {
            [id: string]: {
                breakpoints: number[]
            }
        },
        sections: {
            [id: string]: {
                styles: {
                    [bp: number]: CSSProperties | undefined
                }
            }
        }
    } = {
        pages: {
            [page.id]: {
                breakpoints: [...page.breakpoints]
            }
        },
        sections: {}
    }
    Object.values(wap.sections).forEach(section => {
        undoMap.sections[section.id] = {
            styles: {
                [bp]: { ...section.styles[bp] },
                [newBp]: undefined
            }
        }
    })
    const res = page.updateBreakpoint(bpIdx, newBp)
    if (res.isUpdated) {
        const redoMap: {
            pages: {
                [id: string]: {
                    breakpoints: number[]
                }
            },
            sections: {
                [id: string]: {
                    styles: {
                        [bp: number]: CSSProperties | undefined
                    }
                }
            }
        } = {
            pages: {
                [page.id]: {
                    breakpoints: [...page.breakpoints]
                }
            },
            sections: {}
        }
        Object.values(wap.sections).forEach(section => {
            redoMap.sections[section.id] = {
                styles: {
                    [bp]: undefined,
                    [newBp]: { ...section.styles[bp] }
                }
            }
        })
        const action = objectRecursiveUpdate.bind(null, wap, undoMap)
        const counterAction = objectRecursiveUpdate.bind(null, wap, redoMap)
        return { ...res, payload: { action, counterAction } }
    }
    return { ...res, payload: undefined }
}

export function addBp(wap: Wap, page: WapPage<PageType>, bp: number): OperationStatus<'isAdded', WapAction> {
    const undoMap: {
        pages: {
            [id: string]: {
                breakpoints: number[]
            }
        },
        sections: {
            [id: string]: {
                styles: {
                    [bp: number]: CSSProperties | undefined
                }
            }
        }
    } = {
        pages: {
            [page.id]: {
                breakpoints: [...page.breakpoints]
            }
        },
        sections: {}
    }
    Object.values(wap.sections).forEach(section => {
        undoMap.sections[section.id] = {
            styles: {
                [bp]: undefined,
            }
        }
    })
    const res = page.addBreakpoint(bp)
    if (res.isAdded) {
        const redoMap: {
            pages: {
                [id: string]: {
                    breakpoints: number[]
                }
            }
        } = {
            pages: {
                [page.id]: {
                    breakpoints: [...page.breakpoints]
                }
            }
        }
        const action = objectRecursiveUpdate.bind(null, wap, undoMap)
        const counterAction = objectRecursiveUpdate.bind(null, wap, redoMap)
        return { ...res, payload: { action, counterAction } }
    }
    return { ...res, payload: undefined }
}

