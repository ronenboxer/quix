import DoubleMenu from "@/components/ui/doubleMenu"
import { useState } from "react"

interface AddInputProps {
    onCloseMenu: () => void
}

export default function AddInput(props: AddInputProps) {
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
                title: 'User Input',
                isHeader: true,
                cmp: <></>
            },
            {
                title: 'Text Input',
                cmp: <></>
            },
            {
                title: 'Text Box',
                cmp: <></>
            },
            {
                title: 'Rich Text',
                cmp: <></>
            },
            {
                title: 'Selection',
                isHeader: true,
                cmp: <></>
            },
            {
                title: 'Radio Buttons',
                cmp: <></>
            },
            {
                title: 'Dropdown',
                cmp: <></>
            },
            {
                title: 'Checkboxes',
                cmp: <></>
            },
            {
                title: 'Date & Time',
                cmp: <></>
            },
            {
                title: 'Upload Buttons',
                cmp: <></>
            },
            {
                title: 'Selection Tags',
                cmp: <></>
            },
            {
                title: 'Advanced',
                isHeader: true,
                cmp: <></>
            },
            {
                title: 'Switch',
                cmp: <></>
            },
            {
                title: 'Progress Bar',
                cmp: <></>
            },
            {
                title: 'Signature Input',
                cmp: <></>
            },
            {
                title: 'Ratings',
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
            title="Add Input Elements"
            extraClasses="add-input-menu"
        />)
}