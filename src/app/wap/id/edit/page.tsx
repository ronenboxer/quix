"use client"
import { ActionLogs, Wap } from "@/model/wap"
import { getWapToEdit } from "@/services/wap.service"
import { useEffect, useRef, useState } from "react"
import EditWapContent from '@/components/pageContents/editWapContent'


export default function EditWap() {
    const [currWap, setCurrWap] = useState<null | Wap>(null)
    const [isUndoable, setIsUndoable] = useState(false)
    const [isRedoable, setIsRedoable] = useState(false)

    const actionLogs = useRef<ActionLogs>({
        undo: [],
        redo: []
    })

    // Wap
    function setCurrWapHandler(wap: Wap | null) { setCurrWap(wap) }

    // Action logs
    function addActionToLogHandler(log: 'undo' | 'redo', action: Function, counterAction: Function, cb?: {
        forth: Function,
        back: Function
    }) {
        actionLogs.current[log].push({ action, counterAction, cb })
        if (log === 'undo' && !isUndoable) setIsUndoable(true)
        if (log === 'redo' && !isRedoable) setIsRedoable(true)
    }

    function undoHandler() {
        if (actionLogs.current.undo.length) {
            const undo = actionLogs.current.undo.splice(-1, 1)[0]
            if (!actionLogs.current.undo.length) setIsUndoable(false)
            addActionToLogHandler('redo', undo.counterAction, undo.action, undo.cb)
            undo.action()
            if (undo.cb?.back) undo.cb.back()
        }
    }
    function redoHandler() {
        if (actionLogs.current.redo.length) {
            const redo = actionLogs.current.redo.splice(-1, 1)[0]
            if (!actionLogs.current.redo.length) setIsRedoable(false)
            addActionToLogHandler('undo', redo.counterAction, redo.action, redo.cb)
            redo.action()
            if (redo.cb?.forth) redo.cb.forth()
        }
    }
    function cleanRedoHandler() {
        actionLogs.current.redo = []
        setIsRedoable(false)
    }

    useEffect(() => {
        getWapToEdit()
            .then((res) => {
                setCurrWap(res)
            })
            .catch((error) => console.error(error));
    }, [])

    return (currWap
        ? <EditWapContent
            wap={currWap}
            onSetCurrWap={setCurrWapHandler}
            onAddActionToLog={addActionToLogHandler}
            onUndo={undoHandler}
            onRedo={redoHandler}
            onCleanRedo={cleanRedoHandler}
            isUndoable={isUndoable}
            isRedoable={isRedoable}
        />
        : <div>Loading</div>
    )
}