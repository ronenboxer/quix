import DoubleMenu from "@/components/ui/doubleMenu"
import { useState } from "react"

interface AddNavigationProps {
    onCloseMenu: ()=>void
}

export default function AddNavigation(props: AddNavigationProps) {
    const { onCloseMenu } = props
    const [currInnerMenuIdx, setCurrInnerMenuIdx] = useState(1)
    const innerMenuWidth = 200
    const outerMenuWidth = 352

    const menuList: {
        title: string,
        cmp: JSX.Element,
        isHeader?: true,
        isDivide?: true
    }[] = [
            {
                title: 'Menus',
                isHeader: true,
                cmp: <></>
            },
            {
                title: 'Horizontal Menus',
                cmp: <></>
            },
            {
                title: 'Styled Horizontal Menus',
                cmp: <></>
            },
            {
                title: 'Anchor Menus',
                cmp: <></>
            },
            {
                title: 'Vertical Menus',
                cmp: <></>
            },
            {
                title: 'Hamburger Menus',
                cmp: <></>
            },
            {
                title: 'Search',
                isHeader: true,
                cmp: <></>
            },
            {
                title: 'Site Search',
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
            title="Add a Navigation Tool"
            extraClasses="add-menus-and-search-menu"
        />)
}