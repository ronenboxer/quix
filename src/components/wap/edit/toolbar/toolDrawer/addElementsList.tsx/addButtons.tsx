import DoubleMenu from "@/components/ui/doubleMenu"
import { useState } from "react"

interface AddButtonsProps {
    onCloseMenu: () => void
}

export default function AddButtons(props: AddButtonsProps) {
    const { onCloseMenu } = props
    const [currInnerMenuIdx, setCurrInnerMenuIdx] = useState(1)
    const innerMenuWidth = 180
    const outerMenuWidth = 352

    const menuList: {
        title: string,
        cmp: JSX.Element,
        isHeader?: true,
        isDivide?: true
    }[] = [
            {
                title: 'Buttons',
                isHeader: true,
                cmp: <></>
            },
            {
                title: 'Basic Buttons',
                cmp: <></>
            },
            {
                title: 'Styled Buttons',
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
            title="Add a Button"
            extraClasses="add-buttons-menu"
        />)
}