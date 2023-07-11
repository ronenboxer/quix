import DoubleMenu from "@/components/ui/doubleMenu"
import { useState } from "react"

interface AddBlogProps {
    onCloseMenu: () => void
}

export default function AddBlog(props: AddBlogProps) {
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
                title: 'Post List (Large)',
                cmp: <></>
            },
            {
                title: 'Post List (Sidebar)',
                cmp: <></>
            },
            {
                title: 'Category Menu',
                cmp: <></>
            },
            {
                title: 'Tag Cloud',
                cmp: <></>
            },
            {
                title: 'Archive',
                cmp: <></>
            },
            {
                title: 'RSS Button',
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
            title="Add Blog Elements"
            extraClasses="add-blog-menu"
        />)
}