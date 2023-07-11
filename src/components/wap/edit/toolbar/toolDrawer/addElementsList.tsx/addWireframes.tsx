import DoubleMenu from "@/components/ui/doubleMenu"
import { useState } from "react"

interface AddWireframesProps {
    onCloseMenu: () => void
}

export default function AddWireframes(props: AddWireframesProps) {
    const { onCloseMenu } = props
    const [currInnerMenuIdx, setCurrInnerMenuIdx] = useState(1)
    const innerMenuWidth = 161
    const outerMenuWidth = 352

    const menuList: {
        title: string,
        cmp: JSX.Element,
        isHeader?: true,
        isDivide?: true
    }[] = [
            {
                title: 'Wireframes',
                isHeader: true,
                cmp: <></>
            },
            {
                title: 'Hero',
                cmp: <></>
            },
            {
                title: 'Cards',
                cmp: <></>
            },
            {
                title: 'Highlight',
                cmp: <></>
            },
            {
                title: 'Slides',
                cmp: <></>
            },
            {
                title: 'Text',
                cmp: <></>
            },
            {
                title: 'List',
                cmp: <></>
            },
            {
                title: 'Zigzag',
                cmp: <></>
            },
            {
                title: 'Mondrian',
                cmp: <></>
            },
            {
                title: 'Sticky Effects',
                cmp: <></>
            },
            {
                title: 'Footers',
                cmp: <></>
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
            title="Add a Wireframe"
            extraClasses="add-wireframes-menu"
        />)
}