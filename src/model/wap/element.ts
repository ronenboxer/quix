import { AllHTMLAttributes, CSSProperties } from "react"
import { Html, OperationStatusObject, StylesMap } from "./misc"
import { makeId } from "@/services/util.service"
import { Page } from "./page"
import { WapObject } from "./wap"

export class Element<T extends Html> {
    protected _id = makeId()

    protected _attributes: {
        [key in keyof AllHTMLAttributes<T>]: AllHTMLAttributes<T>
    } = {}
    protected _specialAttributes: {
        [key: string]: any
    } = {}
    protected _styles: StylesMap = {}
    protected _globalStyles: CSSProperties = {}
    protected _tag: T
    protected _parentWap: WapObject
    protected _sectionId: string | null = null
    protected _parentId: string | null = null
    protected _name = 'Element'

    constructor(tag: T, bps: number[], parentWap: WapObject, sectionId: string | null = null, parentId: string | null = null) {
        this._tag = tag
        this._parentWap = parentWap
        this._sectionId = sectionId
        this._parentId = parentId
        bps.forEach(bp => this._styles[bp] = {})
    }

    // Props
    get id() { return this._id }
    get name() { return this._name }
    get attributes() { return this._attributes }
    set attributes(attributes: {
        [key in keyof AllHTMLAttributes<T>]: AllHTMLAttributes<T>
    }) { this._attributes = attributes }
    get specialAttributes() { return this._specialAttributes }
    set specialAttributes(specialAttributes: {
        [key: string]: any
    }) { this._specialAttributes = specialAttributes }
    get styles() { return this._styles }
    set styles(styles: StylesMap) { this._styles = styles }
    get globalStyles() { return this._globalStyles }
    set globalStyles(styles: CSSProperties) { this._globalStyles = styles }
    get sectionId() { return this._sectionId }
    set sectionId(sectionId: string | null) { this._sectionId = sectionId }
    get parentId() { return this._parentId }
    set parentId(parentId: string | null) { this._parentId = parentId }
    get parentWap() { return this._parentWap }
    set parentWap(wap: WapObject) { this._parentWap = wap }

    // Breakpoints Methods
    updateBreakpoint(currVal: number, newVal: number): OperationStatusObject<'isUpdated'> {
        if (!this._styles[currVal]) return {
            isUpdated: false,
            status: 'error',
            message: `Cannot find ${currVal} breakpoint on element ${this._tag}, id: ${this.id}`
        }
        this._styles[newVal] = this._styles[currVal]
        delete this._styles[currVal]
        return {
            isUpdated: true,
            status: 'success'
        }
    }
    addBreakpoint(breakpoint: number): void {
        let bps = Object.keys(this._styles).sort((a, b) => (+b) - (+a)).map(key => +key)
        let idx = 0
        for (let i = 0; i < bps.length; i++) {
            if (bps[i] < breakpoint) break
            idx++
        }
        const nextBp = bps[idx + 1] || bps[bps.length - 1]
        this._styles[breakpoint] = JSON.parse(JSON.stringify(this._styles[nextBp]))
    }
    removeBreakpoint(breakpoint: number): OperationStatusObject<'isRemoved', CSSProperties> {
        if (!this._styles[breakpoint]) return {
            isRemoved: false,
            status: 'warning',
            message: `Could not find style on element: ${this.id}, breakpoint: ${breakpoint}`
        }
        const styles = this._styles[breakpoint]
        delete this._styles[breakpoint]
        return {
            isRemoved: true,
            status: 'success',
            payload: styles
        }
    }
}