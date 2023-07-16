import { useSvg } from "@/components/shared/useSvg";
import VerticalDivider from "@/components/shared/verticalDivider";
import { Box, IconButton, Tooltip } from "@mui/material";

interface ActionsBoxProps {
    isUndoable: boolean
    isRedoable: boolean
    onUndo: () => void
    onRedo: () => void
}

export default function ActionsBox(props: ActionsBoxProps) {
    const { isUndoable, isRedoable, onUndo, onRedo } = props

    // Actions
    function undoHandler() { onUndo() }
    function redoHandler() { onRedo() }
    return (
        <Box className="action-tools flex items-center h-100">
            {isUndoable
                ? <Tooltip title="Undo" disableFocusListener disableTouchListener>
                    <IconButton
                        className="action-button"
                        onClick={undoHandler}
                    >{useSvg('headerUndo')}</IconButton>
                </Tooltip>
                :
                <IconButton
                    className="action-button white-200-fill"
                    disabled
                >{useSvg('headerUndo')}</IconButton>
            }
            {isRedoable
                ? <Tooltip title="Redo" disableFocusListener disableTouchListener>
                    <IconButton
                        className="action-button"
                        onClick={redoHandler}
                    >{useSvg('headerRedo')}</IconButton>
                </Tooltip>
                :
                <IconButton
                    className="action-button white-200-fill"
                    disabled
                >{useSvg('headerRedo')}</IconButton>
            }
            <VerticalDivider height={50} colorClassName="white-200" styles={{
                marginInline: '8px'
            }}/>
        </Box>)
}