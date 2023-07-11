import { makeId } from "@/services/util.service"
import { OperationStatusObject, WapPageType, WapScreenType, WapSectionType } from "./misc"
import { Section } from "./section"
import { WapObject } from "./wap"
import { Container } from "./container"

const MIN_BREAKPOINT = 320
const MAX_BREAKPOINT = 10000
const DEFAULT_BREAKPOINTS: number[] = [1250, 1000, 750, 500, MIN_BREAKPOINT - 1]

export class Page<T extends WapPageType> {
    static minBreakpoint = MIN_BREAKPOINT
    static maxBreakpoint = MAX_BREAKPOINT
    static maxBreakpointCount = 6
    static defaultBreakpoints = DEFAULT_BREAKPOINTS
    static defaultNewColWidth = '800px'

    protected _id = makeId()
    protected _name = 'Page'
    protected _breakpoints: number[] = Page.defaultBreakpoints
    protected _sections: {
        [sectionId: string]: WapSectionType
    } = {}

    protected _sectionsIds: {
        ids: string[],
        isVertical: boolean
        width: string
    }[] = [
            { ids: [], isVertical: false, width: '1fr' }
        ]
    protected _headerId: string | null = null
    protected _footerId: string | null = null
    protected _mainColIdx = 0

    constructor(protected _title: string, protected _type: T, private _parentWap: WapObject) {
        const globals = _parentWap.globals
        _parentWap.pages[this.id] = this

        if (globals.header.defaultId) {
            this._headerId = globals.header.defaultId
            this.sections[this._headerId] = 'header'
            this.sectionsIds[this.mainCol].ids = [this.headerId!]
        }
        else _parentWap.addSectionToPage(this._id, 0, 'header', false, false)

        if (globals.section.ids.length) {
            const sections = globals.section.ids.reduce((map, id) => {
                map[id] = _parentWap.sections[id]!.type
                return map
            }, {} as { [id: string]: WapSectionType })
            this.sections = sections
        }
        else _parentWap.addSectionToPage(this._id, 1, 'section', false, false)

        if (globals.footer.defaultId) {
            this._footerId = globals.footer.defaultId
            this.sections[this._footerId] = 'footer'
            this.sectionsIds[this.mainCol].ids.push(this.footerId!)
        }
        else _parentWap.addSectionToPage(this._id, this._sectionsIds[this._mainColIdx].ids.length, 'footer', false, false)
    }

    // Props
    get id() { return this._id }
    get name() { return this._name }
    get type() { return this._type }
    get title() { return this._title }
    set title(title: string) { this._title = title }
    get parentWap() { return this._parentWap }
    set parentWap(wap: WapObject) { this._parentWap = wap }
    static get screenType() {
        return (breakpoint: number): WapScreenType => {
            if (breakpoint > 1000) return 'desktop'
            if (breakpoint > 500) return 'tablet'
            return 'mobile'
        }
    }
    get pageHeight() {
        return (breakpoint: number) => {
            if (breakpoint < Page.minBreakpoint) breakpoint = Page.minBreakpoint
            return this.mainColSections.reduce((height, section) => {
                return height + (section.styles[breakpoint].height
                    ? +parseFloat(section.styles[breakpoint].height + '')
                    : 0)
            }, 0)
        }
    }

    // Columns
    get cols() { return this._sectionsIds.map(col => col.width) }
    get rows() {
        return (breakpoint: number) => {
            const rows: string[] = []
            if (breakpoint < Page.minBreakpoint) breakpoint = Page.minBreakpoint
            return this._sectionsIds[this._mainColIdx].ids
                .map(id => this._parentWap.sections[id || ''] || null)
                .filter(section => section)
                .map(section => section.styles[breakpoint]?.height
                    ? section.styles[breakpoint]?.height
                    : null)
                .filter(row => row)
        }
    }
    get rowCount() { return this.sectionsIds[this.mainCol].ids.length }
    get colCount() { return this.sectionsIds.length }
    get mainCol() { return this._mainColIdx }
    private set mainCol(idx: number) { this._mainColIdx = idx }

    // Breakpoints Methods
    get formattedBreakpoints(): {
        start: number,
        end: number | null,
        text: string,
        screenType: WapScreenType
    }[] {
        const { minBreakpoint, maxBreakpoint } = Page
        const breakpoints = this._breakpoints
        const breakpointsCount = breakpoints.length
        return breakpoints.length
            ? [
                ...breakpoints.map((bp, idx, bps) => {
                    if (idx === 0) return {
                        start: bp,
                        end: null,
                        text: `${bp + 1} and up`,
                        screenType: 'desktop' as WapScreenType
                    }
                    return {
                        start: bp,
                        end: bps[idx - 1],
                        text: `${bps[idx - 1]}px and bellow`,
                        screenType: Page.screenType(bp + 1) as WapScreenType
                    }
                }),
                // {
                //     start: minBreakpoint,
                //     end: breakpoints[breakpointsCount - 1],
                //     text: `${breakpoints[breakpointsCount - 1]}px and bellow`,
                //     screenType: 'mobile' as WapScreenType
                // }
            ]
            : [{
                start: minBreakpoint,
                end: null,
                text: `${minBreakpoint} and up`,
                screenType: 'desktop' as WapScreenType
            }]
    }
    get breakpoints() { return this._breakpoints }
    set breakpoints(breakpoints: number[]) {
        if (breakpoints.length >= Page.maxBreakpointCount) return
        const newBps = breakpoints
            .reduce((arr, bp) => {
                if (!arr.includes(bp)) arr.push(bp)
                return arr
            }, [] as number[])
        const sharedBps: number[] = []
        const unsharedBps = newBps.filter(bp => {
            if (!this._breakpoints.includes(bp)) return true
            sharedBps.push(bp)
            return false
        })
        this._breakpoints.forEach((_, idx) => this._parentWap.removeBreakpoint(this._id, idx))
        const addedBps: number[] = [...sharedBps]
        sharedBps.forEach(bp => this._parentWap.addBreakpoint(this._id, bp))
        unsharedBps.forEach(bp => {
            const res = this._parentWap.addBreakpoint(this._id, bp)
            if (res.isAdded) addedBps.push(bp)
        })
        this._breakpoints = addedBps.sort((a, b) => b - a)
    }
    get correspondingBreakpointIdx() {
        return (screenWidth: number) => {
            const bps = this.formattedBreakpoints
            let idx: number
            for (idx = 0; idx < bps.length - 1; idx++) {
                if (screenWidth >= bps[idx].start) return idx
            }
            return idx
        }
    }
    checkNewBreakpointAvailability(breakpoint: number): OperationStatusObject<'isAvailable'> {
        const { minBreakpoint, maxBreakpoint } = Page
        if (breakpoint < minBreakpoint ||
            breakpoint > maxBreakpoint)
            return {
                isAvailable: false,
                status: 'error',
                message: `Breakpoints must be between ${minBreakpoint} px and ${maxBreakpoint} px.`
            }
        if (!this._breakpoints.length || this._breakpoints.every(bp => Math.abs(breakpoint - bp) > 1)) return { isAvailable: true, status: 'success' }
        return {
            isAvailable: false,
            status: 'info',
            message: 'Breakpoints ranges must be at least 1 px.'
        }
    }
    checkExistingBreakpointAvailability(bpIdx: number, newVal: number): OperationStatusObject<'isAvailable'> {
        if (bpIdx < 0 || bpIdx >= this._breakpoints.length) return {
            isAvailable: false,
            status: 'error',
            message: 'Invalid breakpoint index: ' + bpIdx
        }
        const { minBreakpoint, maxBreakpoint } = Page
        if (this._breakpoints.length === 1) {
            if (newVal <= minBreakpoint || newVal > maxBreakpoint) return {
                isAvailable: false,
                status: 'info',
                message: `Breakpoint ranges must be between ${minBreakpoint + 1} px and ${maxBreakpoint} px.`
            }
            return { isAvailable: true, status: 'success' }
        }
        const formattedBreakpoints = [maxBreakpoint + 2, ...this._breakpoints, minBreakpoint]
        const idx = bpIdx + 1
        const lowLimit = formattedBreakpoints[idx + 1] + 1
        const highLimit = formattedBreakpoints[idx - 1] - 2
        if (newVal <= lowLimit || newVal > highLimit) return {
            isAvailable: false,
            status: 'info',
            message: `Breakpoint must be between ${lowLimit + 1} px and ${highLimit} px.`
        }
        return {
            isAvailable: true,
            status: 'success'
        }
    }
    addBreakpoint(breakpoint: number): OperationStatusObject<'isAdded'> {
        if (this._breakpoints.length === 6) return {
            isAdded: false,
            status: 'info',
            message: 'You can add up to 6 custom breakpoints to each page.'
        }
        const res = this.checkNewBreakpointAvailability(breakpoint)
        if (!res.isAvailable) return { ...res, isAdded: false }
        this._breakpoints.push(breakpoint)
        this._breakpoints = this._breakpoints.sort((a, b) => b - a)
        Object.keys(this._sections).forEach(id => {
            const section = this.parentWap.sections[id]
            section.gridCols = { bp: breakpoint, gridCols: [Container.defaultGridSize] }
            section.gridRows = { bp: breakpoint, gridRows: [Container.defaultGridSize] }
        })
        return { isAdded: true, status: 'success' }
    }
    updateBreakpoint(bpIdx: number, newVal: number): OperationStatusObject<'isUpdated', number> {
        const res = this.checkExistingBreakpointAvailability(bpIdx, newVal)
        if (!res.isAvailable) return { ...res, isUpdated: false }
        const currVal = this._breakpoints[bpIdx]
        if (newVal === currVal) return { isUpdated: true, status: 'success', payload: currVal }
        this._breakpoints[bpIdx] = newVal
        this._breakpoints = this._breakpoints.sort((a, b) => b - a)
        return { isUpdated: true, status: 'success', payload: currVal }
    }
    removeBreakpoint(bpIdx: number): OperationStatusObject<'isRemoved', number> {
        if (bpIdx < 0 || bpIdx >= this._breakpoints.length) return {
            status: 'error',
            isRemoved: false,
            message: `Invalid breakpoint index: ${bpIdx}`
        }
        const removedBp = this._breakpoints.splice(bpIdx, 1)[0]
        return {
            isRemoved: true,
            status: 'success',
            payload: removedBp
        }
    }

    // Section Methods
    get headerId() { return this._headerId }
    set headerId(id: string | null) { this._headerId = id }
    get footerId() { return this._footerId }
    set footerId(id: string | null) { this._footerId = id }
    get sections() { return this._sections }
    set sections(sections: { [id: string]: WapSectionType }) {
        this._sections = sections
    }
    get sectionCol() {
        return (section: Section<WapSectionType>) => {
            if (section.type !== 'section') return this._mainColIdx
            return this._sectionsIds.findIndex(col => col.ids.includes(section.id))
        }
    }
    get sectionRow() {
        return (section: Section<WapSectionType>) => {
            if (section.isVertical) return -1
            if (section.type === 'header') return 0
            if (section.type === 'footer') return this.sectionsIds[this.mainCol].ids.length - 1
            return this.sectionsIds[this.mainCol].ids.indexOf(section.id)
        }
    }
    get sectionsIds() { return this._sectionsIds }
    set sectionsIds(sectionsIds: {
        ids: string[],
        isVertical: boolean,
        width: string
    }[]) {
        this._sectionsIds = sectionsIds
        this._mainColIdx = sectionsIds.findIndex(col => !col.isVertical)
        const mainColSectionCount = this.sectionsIds[this.mainCol].ids.length
        const firstMainColSectionId = this.sectionsIds[this.mainCol].ids[0]
        const lastMainColSectionId = this.sectionsIds[this.mainCol].ids[mainColSectionCount - 1]
        if (this.sections[firstMainColSectionId] === 'header') this.headerId = firstMainColSectionId
        if (this.sections[lastMainColSectionId] === 'footer') this.footerId = lastMainColSectionId
    }
    get allSectionIds() {
        const ids: string[] = []
        this.sectionsIds.forEach((col, idx) => idx === this.mainCol
            ? ids.push(...col.ids)
            : ids.push(...col.ids))
        return ids
    }
    get allSections() { return this.allSectionIds.map(id => this.parentWap.sections[id]!) }
    get mainColSectionIds() {
        return this.sectionsIds[this.mainCol].ids
    }
    get mainColSections() {
        return this.mainColSectionIds.map(id => this.parentWap.sections[id]!)
    }
    get miniSections() { return this._sections }
    addSection<T extends WapSectionType>(idx: number, sectionType: T, isVertical: boolean, isGlobal: boolean, existingSection?: Section<T>): OperationStatusObject<'isAdded', Section<T>> {
        const sectionCount = this._sectionsIds[this._mainColIdx].ids.length
        const newSection = existingSection || new Section(sectionType, isVertical, isGlobal, this.parentWap, this._breakpoints)
        newSection.name = isVertical ? 'Vertical Section' : 'Section'
        switch (sectionType) {
            case 'header':
                if (this.headerId) return {
                    isAdded: false,
                    status: 'warning',
                    message: 'This page already has a header'
                }
                this.headerId = newSection.id
                this._sectionsIds[this._mainColIdx].ids.unshift(this.headerId!)
                break
            case 'footer':
                if (this.footerId) return {
                    isAdded: false,
                    status: 'warning',
                    message: 'This page already has a footer'
                }
                this.footerId = newSection.id
                this._sectionsIds[this._mainColIdx].ids.push(this.footerId!)
                break
            default:
                if (!isVertical) {
                    if ((this.headerId && idx < 0) || (this.footerId && idx > sectionCount)) return {
                        isAdded: false,
                        status: 'warning',
                        message: 'Cannot add section past header and footer'
                    }
                    this._sectionsIds[this._mainColIdx].ids.splice(idx, 0, newSection.id)
                } else {
                    if (idx < 0 || idx > this.cols.length) return {
                        isAdded: false,
                        status: 'warning',
                        message: 'Cannot skip columns'
                    }
                    this._sectionsIds.splice(idx, 0, {
                        isVertical: true,
                        ids: [newSection.id],
                        width: '300px'
                    })
                }
        }
        if (isVertical && idx <= this.mainCol) this.mainCol++
        this._sections[newSection.id] = newSection.type
        return {
            isAdded: true,
            status: 'success',
            payload: newSection!
        }
    }
    removeSection(section: Section<WapSectionType>): OperationStatusObject<'isRemoved'> {
        const { id: sectionId, isVertical, type: sectionType } = section
        let colIdx = this.sectionsIds.findIndex(col => col.ids.includes(sectionId))
        if (colIdx === -1) {
            if (this.headerId === sectionId || this.footerId === sectionId) colIdx = this.mainCol
            else return {
                isRemoved: false,
                status: 'error',
                message: 'Could not locate section on this page: ' + this.id
            }
        }
        if (isVertical) {
            this.sectionsIds.splice(colIdx, 1)
            if (colIdx < this.mainCol) this.mainCol--
        } else {
            switch (sectionType) {
                case 'header':
                    this.headerId = null
                    break
                case 'footer':
                    this.footerId = null
                    break
                default:
                    const rowIdx = this.sectionsIds[colIdx].ids.indexOf(sectionId)
                    if (rowIdx === -1) return {
                        isRemoved: false,
                        status: 'error',
                        message: 'Could not locate section on this page'
                    }
                    this.sectionsIds[colIdx].ids.splice(rowIdx, 1)
            }
        }
        return {
            isRemoved: true,
            status: 'success',
        }
    }
}