import { HtmlTags, OperationStatus, PageType, WapElement, WapPage } from "@/model/wap";
import { WapAction } from "@/model/wap/misc";
import { CSSProperties } from "react";

export function updateStyle<T extends WapElement<HtmlTags> | WapPage<PageType>>(props: {
    bp: number,
    styles: CSSProperties,
    element: T
    isGlobal?: boolean
}): OperationStatus<'isUpdated', WapAction> {
    const { bp, styles, element, isGlobal = false } = props
    const currStyles = { ...element.styles }
    const currGlobalStyles = element.globalStyles
    const updatedStyles: CSSProperties = { ...element.styles, [bp]: { ...styles } }
    const updatedGlobalStyles: CSSProperties = { ...currGlobalStyles, ...styles }
    const action = isGlobal
        ? () => element.globalStyles = currGlobalStyles
        : () => element.styles = { ...currStyles }
    const counterAction = isGlobal
        ? () => element.globalStyles = updatedGlobalStyles
        : () => element.styles = { ...updatedStyles }
    counterAction()
    return {
        isUpdated: true,
        status: 'success',
        payload: { action, counterAction }
    }
}