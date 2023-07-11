import { useSvg } from "@/components/shared/useSvg";
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
                    >{useSvg('header_undo')}</IconButton>
                </Tooltip>
                :
                    <IconButton
                        className="action-button white-200 fill"
                        disabled
                    >{useSvg('header_undo')}</IconButton>
            }
            {isRedoable
                ? <Tooltip title="Redo" disableFocusListener disableTouchListener>
                    <IconButton
                        className="action-button"
                        onClick={redoHandler}
                    >{useSvg('header_redo')}</IconButton>
                </Tooltip>
                :
                    <IconButton
                        className="action-button white-200 fill"
                        disabled
                    >{useSvg('header_redo')}</IconButton>
            }
        </Box>)
}