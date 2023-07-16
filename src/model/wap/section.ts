import { WapSectionType } from "./misc"
import { Container } from "./container"
import { Page } from "./page"
import { WapObject } from "./wap"

export class Section<T extends WapSectionType> extends Container<'section'> {
    protected _isGlobal: boolean
    protected _type: T
    protected _isVertical: boolean
    protected _name: 'Section' | 'Vertical Section' = 'Section'

    constructor(type: T, isVertical: boolean, isGlobal: boolean, parentWap: WapObject, bps: number[]) {
        super('section', bps, parentWap, null, null)
        this._type = type
        this._isVertical = isVertical
        this._isGlobal = isGlobal
        this._parentWap = parentWap;
        [...bps, Page.minBreakpoint].forEach(bp => {
            this.styles[bp] = {
                width: isVertical
                    ? '300px'
                    : '100%',
                height: isVertical
                    ? '100%'
                    : '300px',
                position: 'relative'
            }
        })
    }

    // Props
    get name() { return this._name }
    set name(name: 'Section' | 'Vertical Section') { this._name = name }
    get type() { return this._type }
    get isGlobal() { return this._isGlobal }
    set isGlobal(value: boolean) { this._isGlobal = value }
    get isVertical() { return this._isVertical }

    deleteSection() { this._parentWap.deleteSection(this.id) }
}