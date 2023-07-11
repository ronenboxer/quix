import { useSvg } from "@/components/shared/useSvg";
import { EditTool, ItemList } from "@/model/DOM";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Fragment, useState } from "react";
import AddElementsDrawer from "./toolDrawer/addElementsDrawer";

interface WapEditToolsProps {

}

export default function WapEditTools(props: WapEditToolsProps) {

    const [currToolDrawer, setCurrToolDrawer] = useState<EditTool | null>(null)

    const tools: ItemList<EditTool> = [
        {
            name: 'addElements',
            icon: useSvg('header_add'),
            title: 'Add Elements'
        },
        {
            name: 'layers',
            icon: useSvg('header_layers'),
            title: 'Layers'
        },
        {
            name: 'globalSections',
            icon: useSvg('header_globals'),
            title: 'Global Sections'
        },
        {
            name: 'pages',
            icon: useSvg('header_pages'),
            title: 'Pages'
        },
        {
            name: 'style',
            icon: useSvg('site_styles'),
            title: 'Site Styles'
        },
    ]

    const drawerMap: {
        [key in EditTool]?: JSX.Element
    } = {
        'addElements': <AddElementsDrawer
            isOpen={currToolDrawer === 'addElements'}
            onSelectToolDrawer={selectToolDrawerHandler}
        />
    }

    function selectToolDrawerHandler(tool: EditTool | null) {
        if (!tool || tool === currToolDrawer) setCurrToolDrawer(null)
        else setCurrToolDrawer(tool)
        // setTimeout(() => {
        // }, 20)
    }

    function getTools() {
        return tools.map(tool =>
            <Fragment key={tool.name}>
                <Tooltip disableFocusListener disableTouchListener title={tool.title}>

                    <IconButton onClick={() => selectToolDrawerHandler(tool.name)}>
                        {tool.icon}
                    </IconButton>
                </Tooltip>
                {drawerMap[tool.name] || null}
            </Fragment>
        )
    }

    return (
        <Box className="edit-tools flex flex-grow-1 items-center h-100">
            {getTools()}
        </Box>
    )
}