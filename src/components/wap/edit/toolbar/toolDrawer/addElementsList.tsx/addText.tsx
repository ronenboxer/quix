import DoubleMenu from "@/components/ui/doubleMenu"
import { useState } from "react";

interface AddTextProps {
    onCloseMenu: () => void
}

export default function AddText(props: AddTextProps) {
    const { onCloseMenu } = props
    const [currInnerMenuIdx, setCurrInnerMenuIdx] = useState(0)
    const innerMenuWidth = 146
    const outerMenuWidth = 352

    const menuList: {
        title: string,
        cmp: JSX.Element
    }[] = [
            {
                title: 'Text Themes',
                cmp: <>Text ThemesText Themes</>
            },
            {
                title: 'Titles',
                cmp: <>TitlesTitles</>
            },
            {
                title: 'Collapsible Text',
                cmp: <>Collapsible TextCollapsible Text</>
            },
            {
                title: 'Text Mask',
                cmp: <>Text MaskText Mask</>
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
            title="Add a Button"
            extraClasses="add-text-menu"
        />)

}