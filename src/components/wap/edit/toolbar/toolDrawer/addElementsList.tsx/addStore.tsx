import DoubleMenu from "@/components/ui/doubleMenu"
import { useState } from "react"

interface AddStoreProps {
    onCloseMenu: ()=>void
}

export default function AddStore(props: AddStoreProps) {
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
                title: 'Grid Product Gallery',
                cmp: <></>
            },
            {
                title: 'Slider Product Gallery',
                cmp: <></>
            },
            {
                title: 'Related Products',
                cmp: <></>
            },
            {
                title: 'Shopping Cart',
                cmp: <></>
            },
            {
                title: 'Add to Cart Button',
                cmp: <></>
            },
            {
                title: 'Currency Convertor',
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
            title="Add Store Elements"
            extraClasses="add-store"
        />)
}