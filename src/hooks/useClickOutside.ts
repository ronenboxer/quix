import { RefObject } from 'react'

import useEventListener from './useEventListener'

type Handler = (event: MouseEvent) => void

function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: Handler,
  mouseEvent: 'click' | 'mousedown' | 'mouseup',
  additionalCheck: boolean | ((ev: MouseEvent) => boolean)
): void {
  useEventListener(mouseEvent, event => {
    const el = ref?.current
    // Do nothing if clicking ref's element or descendent elements
    let res: boolean
    if (typeof additionalCheck === 'boolean') res = additionalCheck
    else res = additionalCheck(event)
    if (res || !el || el.contains(event.target as Node) || !additionalCheck) {
      return
    }

    handler(event)
  })
}

export default useOnClickOutside
