import { WapSizeUnit } from "../wap/misc"

export type ItemList<T = string> = {
    title: string,
    icon: JSX.Element
    name: T
}[]

export type EditTool = 'addElements' | 'layers' | 'globalSections' | 'pages' | 'style'

interface FlagMatchingLang {
    il: {
        key: 'he',
        value: 'hebrew'
    },
    us: {
        key: 'en',
        value: 'english'
    },
}

export type Anchor = 'top' | 'bottom' | 'left' | 'right'

export type Flag = keyof FlagMatchingLang

export const FLAG_LANG_MAP: FlagMatchingLang = {
    il: {
        key: 'he',
        value: 'hebrew'
    },
    us: {
        key: 'en',
        value: 'english'
    },
}

export interface PageRefMap {
    pageRef: HTMLElement | null
    sections: {
        [id: string]: RefMap
    }
}

export interface ElementSize {
    sizeMap: { [K in WapSizeUnit]: number }
    totalUnits: { [K in WapSizeUnit]: number }
    absoluteSizes: number[]
    cumulativeSizes: number[]
}

export interface SectionRefMap extends RefMap {
    colSizes: ElementSize
    rowSizes: ElementSize
}

export interface RefMap {
    ref: HTMLElement | null
    children?: {
        [id: string]: RefMap
    }
    grid: {
        cols: {
            idxs: [number, number],
        } & ElementSize,
        rows: {
            idxs: [number, number],
        } & ElementSize,
    }
}

export type Orientation = 'cols' | 'rows'

export interface DOMGridLayout {
    colIdxs: [number, number],
    colSizes: number[],
    rowIdxs: [number, number],
    rowSizes: number[]
}

export type DragMode = 'grid-resize-rows' | 'grid-resize-cols' | 'grid-canvas-edit-rows' | 'grid-canvas-edit-cols'
export type ViewMode = 'grid-canvas-edit'