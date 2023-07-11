import { CSSProperties } from "react";

export type Text = 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label' | 'a' | 'button'
export type HtmlAction = 'a' | 'button'
export type HtmlMedia = 'img' | 'video' | 'iframe'
export type HtmlSection = 'section'
export type HtmlContainer = 'ul' | 'ol' | 'li' | 'div' | 'form' | 'nav' | 'header' | 'footer'
export type HtmlInput = 'input' | 'textarea' | 'select'
export type WapPageType = "Main Pages" | "Lightboxes" | "Member Pages" | "NewsPages (Dynamic)" | "Projects Pages (Dynamic)" | "Blog Pages" | "Stores"
export type WapSectionType = 'header' | 'footer' | 'section'
export type WapScreenType = 'desktop' | 'tablet' | 'mobile'
export type Html = Text | HtmlAction | HtmlMedia | HtmlSection | HtmlContainer | HtmlInput
export type WapPageBreakpoint = {
    start: number
    end: number | null
    text: string
    screenType: WapScreenType
}

export interface StylesMap {
    [key: number]: CSSProperties
}

export type WapSizeUnit = 'fr' | 'px' | '%' | 'vw' | 'vh'
export type WapSizeMap = { [K in WapSizeUnit]: number }

export interface WapGridCellSizeFormat {
    value: number
    unit: WapSizeUnit
    content?: 'min-content' | 'max-content'
}

export interface WapGridCellSize extends WapGridCellSizeFormat {
    minmax?: {
        min: {
            value: number
            unit: WapSizeUnit
        }
        max: {
            value: number
            unit: WapSizeUnit
        }
    }
}
export interface WapGridLayout {
    rows: WapGridCellSize[]
    cols: WapGridCellSize[]
}

export type OperationStatusObject<T extends string, K = any> = {
    [key in T]: boolean
} & {
    status: 'success' | 'error' | 'warning' | 'info'
    message?: string | string[],
    payload?: K
}
export interface WapAction {
    action: Function
    counterAction: Function
    cb?: {
        forth: Function
        back: Function
    }
}

export interface WapActionLogs {
    undo: WapAction[],
    redo: WapAction[],
}