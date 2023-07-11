import { OperationStatus, PageType, SectionType, Wap, WapPage } from "@/model/wap"
import { WapAction } from "@/model/wap/misc"

export function addSection(wap: Wap, page: WapPage<PageType>, idx: number, sectionType: SectionType, isVertical: boolean, isGlobal: boolean): OperationStatus<'isAdded', WapAction> {
    const res = wap.addSectionToPage(page.id, idx, sectionType, isVertical, isGlobal)
    if (res.isAdded) {
        const section = res.payload!
        const action = () => wap.removeSectionFromPage(page.id, section.id, true)
        const counterAction = () => wap.addSectionToPage(page.id, idx, sectionType, isVertical, isGlobal, section)
        return {
            ...res, payload: {
                action, counterAction
            }
        }
    }
    return { ...res, payload: undefined }
}