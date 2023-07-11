import { Flag } from "../DOM"
import { Element } from "./element"
import { Text } from "./misc"

export class WapText<T extends Text> extends Element<T> {
    private static _default: {
        [tag in Text]: string
    } = {
            p: 'Add paragraph text. Click “Edit Text” to customize this theme across your site. You can update and reuse text themes.',
            h1: 'Add a Title',
            h2: 'Add a Title',
            h3: 'Add a Title',
            h4: 'Add a Title',
            h5: 'Add a Title',
            h6: 'Add a Title',
            span: 'Add paragraph text. Click “Edit Text” to customize this theme across your site. You can update and reuse text themes.',
            label: 'This is an input label',
            a: 'This is a link',
            button: 'Start Now'
        }
    protected _text: string = ''
    
    protected _i18: {
        [lang in Flag]?: string
    } = {}

    // constructor(protected _tag: T, protected _sectionId: string) {
    //     super(_tag, _sectionId)
    //     this._text = WapText._default[_tag]
    // }
}