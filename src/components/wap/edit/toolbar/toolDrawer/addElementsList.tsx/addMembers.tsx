import DoubleMenu from "@/components/ui/doubleMenu"
import { useState } from "react"

interface AddMembersProps {
    onCloseMenu: ()=>void
}

export default function AddMembers(props: AddMembersProps) {
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
                title: 'Login Bar',
                cmp: <></>
            },
            {
                title: 'Member Menu',
                cmp: <></>
            },
            {
                title: 'Member Profile Card',
                cmp: <></>
            },
            {
                title: 'Members Page',
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
            title="Add Member Elements"
            extraClasses="add-members-menu"
        />)
}