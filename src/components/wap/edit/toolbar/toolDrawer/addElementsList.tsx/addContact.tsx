import DoubleMenu from "@/components/ui/doubleMenu"
import { useState } from "react"

interface AddContactProps {
    onCloseMenu: ()=>void
}

export default function AddContact(props: AddContactProps) {
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
                title: 'Forms',
                isHeader: true,
                cmp: <></>
            },
            {
                title: 'Contact',
                cmp: <></>
            },
            {
                title: 'Subscribe',
                cmp: <></>
            },
            {
                title: 'Sale Leads',
                cmp: <></>
            },
            {
                title: 'Job Application',
                cmp: <></>
            },
            {
                title: 'Google Maps',
                isHeader: true,
                cmp: <></>
            },
            {
                title: 'Maps',
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
            title="Add a Contact Tool"
            extraClasses="add-contact-menu"
        />)
}