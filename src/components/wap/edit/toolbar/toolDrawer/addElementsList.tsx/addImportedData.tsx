import DoubleMenu from "@/components/ui/doubleMenu"
import { useState } from "react"

interface AddImportedDataProps {
    onCloseMenu: ()=>void
}

export default function AddImportedData(props: AddImportedDataProps) {
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
                title: 'Embed',
                isHeader: true,
                cmp: <></>
            },
            {
                title: 'Embed Code',
                cmp: <></>
            },
            {
                title: 'Embed Site',
                cmp: <></>
            },
            {
                title: 'Custom Element',
                cmp: <></>
            },
            {
                title: 'Lottie Animation',
                cmp: <></>
            },
            {
                title: 'Social',
                isHeader: true,
                cmp: <></>
            },
            {
                title: 'Social Bar',
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
            title="Add Embed or Social Tool"
            extraClasses="add-imported-data-menu"
        />)
}