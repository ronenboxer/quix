import DoubleMenu from "@/components/ui/doubleMenu"
import { useState } from "react"

interface AddLayoutToolsProps {
    onCloseMenu: () => void
}

export default function AddLayoutTools(props: AddLayoutToolsProps) {
    const { onCloseMenu } = props
    const [currInnerMenuIdx, setCurrInnerMenuIdx] = useState(1)
    const innerMenuWidth = 146
    const outerMenuWidth = 352

    const menuList: {
        title: string,
        cmp: JSX.Element,
        isHeader?: true,
        isDivide?: true
    }[] = [
            {
                title: 'Containers',
                isHeader: true,
                cmp: <></>
            },
            {
                title: 'Empty Boxes',
                cmp: <>Empty</>
            },
            {
                title: 'Grids',
                cmp: <>Grids</>
            },
            {
                title: 'Layouters',
                cmp: <>Layouters</>
            },
            {
                title: 'Repeaters',
                cmp: <>Repeaters</>
            },
            {
                title: 'Lightboxes',
                cmp: <>Lightboxes</>
            },
            {
                title: 'Tabs',
                cmp: <>Tabs</>
            },
            {
                title: 'Accordion',
                cmp: <>Accordion</>
            },
        ]

    function selectInnerMenuHandler(idx: number) {
        if (currInnerMenuIdx !== idx) setCurrInnerMenuIdx(idx)
    }
    function closeMenuHandler() { onCloseMenu() }

    return (
        <DoubleMenu
            onCloseMenu={closeMenuHandler}
            innerMenuWidth={innerMenuWidth}
            outerMenuWidth={outerMenuWidth}
            menuList={menuList}
            currInnerMenuIdx={currInnerMenuIdx}
            onSetCurrInnerMenuIdx={selectInnerMenuHandler}
            title="Layout Tools"
            extraClasses="add-layout-tool-menu"
        />)
}