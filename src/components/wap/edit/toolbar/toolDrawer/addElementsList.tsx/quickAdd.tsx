import { useSvg } from "@/components/shared/useSvg";
import { ItemList } from "@/model/DOM";
import { HtmlTags } from "@/model/wap";
import { Box, Button, Icon, IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";

interface QuickAddProps {
    onCloseMenu: ()=>void
}

export default function QuickAdd(props: QuickAddProps) {
    const { onCloseMenu } = props
    const items: ItemList = [
        {
            title: 'Title',
            icon: useSvg('addTitle'),
            name: 'title'
        },
        {
            title: 'Paragraph',
            icon: useSvg('addParagraph'),
            name: 'paragraph'
        },
        {
            title: 'Button',
            icon: useSvg('addButton'),
            name: 'button'
        },
        {
            title: 'Image',
            icon: useSvg('addImage'),
            name: 'image'
        },
        {
            title: 'Video',
            icon: useSvg('addVideo'),
            name: 'video'
        },
        {
            title: 'Gallery',
            icon: useSvg('addGallery'),
            name: 'gallery'
        },
        {
            title: 'Container',
            icon: useSvg('addContainer'),
            name: 'container'
        },
        {
            title: 'Layouter',
            icon: useSvg('addLayouter'),
            name: 'layouter'
        },
        {
            title: 'Repeater',
            icon: useSvg('addRepeater'),
            name: 'repeater'
        },
        {
            title: 'IFrame',
            icon: useSvg('addIframe'),
            name: 'iframe'
        },
    ]
    function closeMenuHandler() { onCloseMenu() }

    return (
        <Box
            className="quick-add w-100"
        sx={{
            // width: '100%',
        }}>
            <Box 
            className="quick-add-header flex items-end gap-4 py-16 px-24 w-100"
            sx={{
                // display: 'flex',
                // alignItems: 'flex-end',
                // gap: '4px',
                // padding: '16px 24px',
                // borderBottom: '1px solid #e5e5e5',
                // width: '100%',
            }}>
                <Typography 
                    className="fw-700 fs-100-rem flex-grow-1"
                sx={{
                    // fontWeight: '700',
                    // fontSize: '1rem',
                    // flexGrow: 1
                }}>
                    Quick Add
                </Typography>
                <IconButton 
                className="pa-0" sx={{
                    // padding: 0
                }}>{useSvg('help')}</IconButton>
                <IconButton onClick={closeMenuHandler}
                className="pa-0"
                sx={{
                    // padding: 0
                }}>{useSvg('close')}</IconButton>
            </Box>
            <Grid container columns={{ xs: 3 }} 
            className="pa-24"
            sx={{
                // padding: '24px'
            }}>
                {items.map(item => <Grid item key={item.name} xs={1} 
                className="flex center"
                sx={{
                    // display: 'flex',
                    // alignItems: 'center',
                    // justifyContent: 'center',
                }}>
                    <Button 
                    className="add-button flex column center ma-16 pa-0 gap-12"
                    sx={{
                        // display: 'flex',
                        // flexDirection: 'column',
                        // alignItems: 'center',
                        // justifyContent: 'center',
                        // height: '100px',
                        // margin: '16px',
                        // padding: 0,
                        color: 'text.primary',
                        fill: 'text.primary',
                        // gap: '12px',
                        // border: '1px solid #e5e5e5',
                        // '&:hover': {
                        //     border: '1px solid #333',
                        // }
                    }}>
                        {item.icon}
                        <Typography 
                        className="capitalize fs-080-rem fw-200"
                        sx={{
                            // textTransform: 'capitalize',
                            // fontSize: '.8rem',
                            // fontWeight: '200',
                        }}>{item.title}</Typography>
                    </Button>
                </Grid>)}
            </Grid>
        </Box>)
}