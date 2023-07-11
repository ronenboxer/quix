import { makeId } from '@/services/util.service'
import { Page } from './page'
import { OperationStatusObject, StylesMap, WapPageType, WapSectionType } from './misc'
import { Section } from './section'
import { Flag } from '../DOM'

export class WapObject {
    protected _id: string = makeId()
    protected _url: string
    protected _pages: { [id: string]: Page<WapPageType> } = {}
    // protected _sectionsByType: {
    //     [K in WapSectionType]: {
    //         [id: string]: Section<K>,
    //     }
    // } = {
    //         header: {},
    //         footer: {},
    //         section: {}
    //     }
    protected _sections: {
        [id: string]: Section<WapSectionType>
    } = {}

    protected _globals: {
        [K in WapSectionType]: {
            defaultId: string | null,
            ids: string[]
        }
    } = {
            header: {
                ids: [],
                defaultId: null,
            },
            footer: {
                ids: [],
                defaultId: null,
            },
            section: {
                ids: [],
                defaultId: null,
            }
        }
    protected _mainLang: Flag = 'us'
    protected _langs: Flag[] = ['us', 'il']

    constructor(protected _name: string) {
        this._url = _name.trim().split(' ').join('-')
        const header = new Section('header', false, true, this, Page.defaultBreakpoints)
        const footer = new Section('footer', false, true, this, Page.defaultBreakpoints)

        this._sections = {
            [header.id]: header,
            [footer.id]: footer
        }
        this.addToGlobals(header, 'header')
        this.addToGlobals(footer, 'footer')
        this.newPage('Home', 'Main Pages')
    }

    // Props
    get id() { return this._id }
    get name() { return this._name }
    set name(name: string) {
        this._name = name.trim()
        this._url = name.trim().split(' ').join('-')
    }
    get url() { return this._url }
    set url(url: string) { this._url = url }

    //Pages Methods
    get pages() { return this._pages }
    set pages(pages: { [key: string]: Page<WapPageType> }) { this._pages = pages }
    get formattedPages(): Partial<{ [T in WapPageType]: Page<T>[] }> {
        const pages: Partial<{ [T in WapPageType]: Page<T>[] }> = {}
        Object.values(this._pages).forEach((page) => {
            if (!pages[page.type]) pages[page.type] = []
                ; (pages[page.type] as Page<typeof page.type>[]).push(page)
        })
        return pages
    }
    get page() {
        return (pageId: string) => {
            return this._pages[pageId] || null
        }
    }
    newPage(name = 'My Page', type: WapPageType = 'Main Pages') { new Page(name, type, this) }
    removePage(pageId: string): OperationStatusObject<'isRemoved', Page<WapPageType>> {
        if (!this.pages[pageId]) return {
            isRemoved: false,
            status: 'error',
            message: 'Page of id: ' + pageId + ' was not found'
        }
        const deletedPage = this.pages[pageId]
        Object.keys(this.sections).forEach(sectionId => this.removeSectionFromPage(pageId, sectionId))
        delete this.pages[pageId]
        return { isRemoved: true, status: 'success', payload: deletedPage }
    }

    // Languages Methods
    get langs(): Flag[] { return this._langs }
    set langs(langs: Flag[]) {
        this._langs = langs
        this._mainLang = langs[0]
    }
    get mainLang(): Flag { return this._mainLang }
    set mainLang(lang: Flag) {
        this._mainLang = lang
        const langIdx = this._langs.indexOf(lang)
        if (langIdx !== -1) this._langs.splice(langIdx, 1)
        this._langs.unshift(lang)
    }
    addLang(lang: Flag, isMainLang: boolean = false): OperationStatusObject<'isAdded'> {
        if (this._langs.includes(lang)) return {
            isAdded: false,
            status: 'warning',
            message: 'Language already exists in wap`s supported languages'
        }
        if (isMainLang) {
            this._langs.unshift(lang)
            this._mainLang = lang
        } else this._langs.push(lang)
        return { isAdded: true, status: 'success' }
    }
    removeLang(lang: Flag): OperationStatusObject<'isRemoved'> {
        if (this._langs.length === 1) return {
            isRemoved: false,
            status: 'warning',
            message: 'Cannot remove last remaining language'
        }
        const langIdx = this._langs.indexOf(lang)
        if (langIdx === -1) return {
            isRemoved: false,
            status: 'error',
            message: 'Language not found in wap`s supported languages'
        }
        this._langs.splice(langIdx, 1)
        if (this._mainLang === lang) this._mainLang = this._langs[0]
        return { isRemoved: true, status: 'success' }
    }

    // Sections Methods
    get globals() { return this._globals }
    set globals(globals: {
        [K in WapSectionType]: {
            defaultId: string | null,
            ids: string[]
        }
    }) {
        Object.values(this._globals).forEach(sections => {
            sections.ids.forEach(id => this._sections[id]!.isGlobal = false)
        })
        this._globals = globals
        Object.values(globals).forEach(sections => {
            sections.ids.forEach(id => this._sections[id]!.isGlobal = true)
        })
    }
    get sectionByTypes() {
        return Object.values(this._sections).reduce((sections, section) => {
            if (!sections[section.type]) sections[section.type] = {}
                ; (sections[section.type] as { [key: string]: Section<WapSectionType> })[section.id] = section
            return sections
        }, {} as {
            [K in WapSectionType]: {
                [id: string]: Section<K>,
            }
        })
    }
    get sections() { return this._sections }
    set sections(sections: {
        [id: string]: Section<WapSectionType>
    }) { this._sections = sections }
    addToGlobals<T extends WapSectionType>(section: Section<T>, sectionType: T): OperationStatusObject<'isAdded'> {
        if (this.globals[sectionType]?.ids?.includes(section.id)) return {
            isAdded: false,
            status: 'warning',
            message: 'Section already in globals'
        }
        this.globals[sectionType]?.ids.push(section.id)
        if (!this.globals[sectionType].defaultId) this.globals[sectionType].defaultId = section.id
        this.sections[section.id].isGlobal = true
        return { isAdded: true, status: 'success' }
    }
    removeFromGlobals<T extends WapSectionType>(sectionId: string, sectionType: T): OperationStatusObject<'isRemoved'> {
        const idx = this.globals[sectionType].ids.indexOf(sectionId)
        if (idx === -1) return {
            isRemoved: false,
            status: 'error',
            message: 'Section not found in globals of type: ' + sectionType
        }
        this.globals[sectionType].ids.splice(idx, 1)
        if (this.globals[sectionType].defaultId) this.globals[sectionType].ids[0] || null
        if (this.sections[sectionId]?.isGlobal) this.sections[sectionId].isGlobal = false
        return { isRemoved: true, status: 'success' }
    }
    addSectionToPage<T extends WapSectionType>(pageId: string, idx: number, sectionType: T, isVertical: boolean, isGlobal: boolean, existingSection?: Section<T>): OperationStatusObject<'isAdded', Section<T>> {
        const page = this._pages[pageId]
        if (!page) return {
            isAdded: false, status: 'error',
            message: 'Page not found'
        }
        const res = page.addSection(idx, sectionType, isVertical, isGlobal, existingSection)
        if (!res.isAdded) return { ...res }
        const addedSection = res.payload!
        this._sections[addedSection.id] = addedSection
        if (isGlobal) this._globals[sectionType].ids.push(addedSection.id)
        return res
    }
    addExistingSectionToPage<T extends WapSectionType>(pageId: string, section: Section<T>) {
        const page = this._pages[pageId]
        if (!page) return {
            isAdded: false, status: 'error',
            message: 'Page not found'
        }

    }
    removeSectionFromPage(pageId: string, sectionId: string, deleteEntirely = false): OperationStatusObject<'isRemoved', Section<WapSectionType>> {
        const page = this.pages[pageId]
        if (!page) return {
            isRemoved: false, status: 'error',
            message: 'Page not found'
        }
        const sectionToRemove = this.sections[sectionId]!
        const res = page.removeSection(sectionToRemove)
        if (!res.isRemoved) return res
        if (!sectionToRemove.isGlobal) delete this.sections[sectionId]
        else if (deleteEntirely) {
            Object.values(this.pages).forEach(page => this.removeSectionFromPage(page.id, sectionId))
            this.removeFromGlobals(sectionId, sectionToRemove.type)
        }
        return { ...res, payload: sectionToRemove }
    }
    deleteSection(sectionId: string) {
        const page = Object.values(this.pages)[0]
        if (page) this.removeSectionFromPage(page.id, sectionId, true)
        else {
            this.removeFromGlobals(sectionId, this.sections[sectionId]!.type)
            delete this.sections[sectionId]
        }
    }

    // Breakpoints methods
    addBreakpoint(pageId: string, breakpoint: number): OperationStatusObject<'isAdded'> {
        const page = this._pages[pageId]
        if (!page) return {
            isAdded: false,
            status: 'error',
            message: 'Page not found'
        }
        const res = page.addBreakpoint(breakpoint)
        if (!res.isAdded) return res
        const { miniSections } = page
        Object.keys(miniSections).forEach(sectionId => {
            this._sections[sectionId]?.addContainerBreakpoint(breakpoint)
        })
        return res
    }
    updateBreakpoint(pageId: string, bpIdx: number, newVal: number): OperationStatusObject<'isUpdated'> {
        const page = this._pages[pageId]
        if (!page) return {
            isUpdated: false, status: 'error',
            message: 'Page not found'
        }
        const res = page.updateBreakpoint(bpIdx, newVal)
        if (!res.isUpdated) return res
        const currVal = res.payload!
        const { miniSections } = page
        Object.keys(miniSections).forEach(sectionId => {
            this._sections[sectionId]?.updateContainerBreakpoint(currVal, newVal)
        })
        return res
    }
    removeBreakpoint(pageId: string, bpIdx: number): OperationStatusObject<'isRemoved', number> {
        const page = this._pages[pageId]
        if (!page) return {
            isRemoved: false, status: 'error',
            message: 'Page not found'
        }
        const res = page.removeBreakpoint(bpIdx)
        if (!res.isRemoved) return res
        const { miniSections } = page
        Object.keys(miniSections).forEach(sectionId => {
            this._sections[sectionId]?.removeContainerBreakpoint(res.payload!)
        })
        return res
    }

    // Delete
    private deletePages() {
        Object.keys(this.pages).forEach(pageId => this.removePage(pageId))
    }
    private deleteSections() {
        Object.keys(this.sections).forEach(sectionId => this.deleteSection(sectionId))
    }
    private deleteGlobals() {
        this.globals = {
            header: {
                ids: [],
                defaultId: null,
            },
            footer: {
                ids: [],
                defaultId: null,
            },
            section: {
                ids: [],
                defaultId: null,
            }
        }
    }
}