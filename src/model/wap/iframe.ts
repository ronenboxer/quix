import { Element } from "./element"

export class WapIFrame extends Element<'iframe'> {
    protected _src: string = ''
    // constructor(protected _sectionId: string) {
    //     super('iframe', _sectionId)
    // }
}