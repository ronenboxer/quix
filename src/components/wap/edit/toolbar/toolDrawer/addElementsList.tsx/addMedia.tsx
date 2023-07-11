import DoubleMenu from "@/components/ui/doubleMenu"
import { useState } from "react"

interface AddMediaProps {
    onCloseMenu: ()=>void
}

export default function AddMedia(props: AddMediaProps) {
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
                title: 'Upload Media',
                isHeader: true,
                cmp: <></>
            },
            {
                title: 'My Uploads',
                cmp: <></>
            },
            {
                title: 'Images',
                isHeader: true,
                cmp: <></>
            },
            {
                title: 'Single Images',
                cmp: <></>
            },
            {
                title: 'Pro Galleries',
                cmp: <></>
            },
            {
                title: 'Video',
                isHeader: true,
                cmp: <></>
            },
            {
                title: 'Single Video Player',
                cmp: <></>
            },
            {
                title: 'VideoBox',
                cmp: <></>
            },
            {
                title: 'Transparent Video',
                cmp: <></>
            },
            {
                title: 'Audio',
                isHeader: true,
                cmp: <></>
            },
            {
                title: 'Mini Players',
                cmp: <></>
            },
            {
                title: 'Explore Media',
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
            title="Add Media"
            extraClasses="add-media-menu"
        />)
}