import DoubleMenu from "@/components/ui/doubleMenu"
import { useState } from "react"

interface AddCompositionsProps {
    onCloseMenu: () => void
}

export default function AddCompositions(props: AddCompositionsProps) {
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
                title: 'Designed Sections',
                isHeader: true,
                cmp: <></>
            },
            {
                title: 'About',
                cmp: <></>
            },
            {
                title: 'Service',
                cmp: <></>
            },
            {
                title: 'Team',
                cmp: <></>
            },
            {
                title: 'Features',
                cmp: <></>
            },
            {
                title: 'Products',
                cmp: <></>
            },
            {
                title: 'Testimonials',
                cmp: <></>
            },
            {
                title: 'FAQs',
                cmp: <></>
            },
            {
                title: 'Projects',
                cmp: <></>
            },
            {
                title: 'Partners',
                cmp: <></>
            },
            {
                title: 'Pricing',
                cmp: <></>
            },
            {
                title: 'Portfolio',
                cmp: <></>
            },
            {
                title: 'Resume',
                cmp: <></>
            },
            {
                title: 'Infographics',
                cmp: <></>
            },
            {
                title: 'Opening Hours',
                cmp: <></>
            },
            {
                title: 'Files',
                cmp: <></>
            },
            {
                title: 'Schedule',
                cmp: <></>
            },
            {
                title: 'Designed Boxes',
                isHeader: true,
                cmp: <></>
            },
            {
                title: 'Boxes',
                cmp: <></>
            },
            {
                title: 'Interactive',
                isHeader: true,
                cmp: <></>
            },
            {
                title: 'Click Sections',
                cmp: <></>
            },
            {
                title: 'Hover Sections',
                cmp: <></>
            },
            {
                title: 'Hover Boxes',
                cmp: <></>
            },
            {
                title: 'Navigation',
                isHeader: true,
                cmp: <></>
            },
            {
                title: 'Headers',
                cmp: <></>
            },
            {
                title: 'Footers',
                cmp: <></>
            },
            {
                title: 'Sidebar',
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
            title="Add a Composition"
            extraClasses="add-composition-menu"
        />)
}