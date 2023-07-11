import { Container } from "./container"
import { WapText } from "./text"

export class WapMenu extends Container<'nav'> {
    protected _items: {[id:string]:WapText<'a'>} = {}
    protected _itemsIds: string[] = []
    protected _animation: string | null = null
    // constructor(protected _sectionId: string) {
    //     super('nav', _sectionId)
    // }
}