import { DOMGridLayout, Orientation, PageRefMap, RefMap } from "@/model/DOM"
import { SizeMap, GridCellSize, HtmlTags, OperationStatus, PageType, SectionType, SizeUnit, Wap, WapContainerEl, WapElement, WapPage, WapSection } from "@/model/wap"
import { WapGridCellSize } from "@/model/wap/misc"
import { blue, lightGreen } from "@mui/material/colors"
import { CSSProperties } from "react"

export function makeId(blockSize = 5, blockCount = 5) {
  const CHARS = 'abcdefghojklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0987654321'
  let id = ''
  for (let i = 0; i < blockCount; i++) {
    if (i) id += '-'
    for (let j = 0; j < blockSize; j++) {
      const idx = getRandomInt(CHARS.length)
      id += CHARS.charAt(idx)
    }
  }
  return id
}

export function getRandomInt(max: number, min = 0, isInclusive = false) {
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + (isInclusive ? 1 : 0)) + Math.ceil(min))
}

export function Capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getFormattedSegments(totalSpace: number, segments: WapGridCellSize[], addedSegment: number): OperationStatus<'isAdded', WapGridCellSize[]> {
  if (addedSegment >= totalSpace || addedSegment <= 0) return {
    isAdded: false,
    status: 'error',
    message: 'New divider out of container bounds'
  }
  if (!segments.length) return {
    isAdded: true,
    status: 'success',
    payload: [{ unit: 'fr', value: addedSegment / totalSpace }]
  }
  const { sizeMap } = getAbsoluteSize(totalSpace, WapContainerEl.getFormattedGridTemplate(segments))
  if (sizeMap.fr < 0) return {
    isAdded: false,
    status: 'warning',
    message: 'Total size exceeds container size'
  }
  let cumulativeSize = 0
  const newFormattedSegments: WapGridCellSize[] = []

  for (let i = 0; i < segments.length; i++) {
    const { unit, value } = segments[i]
    const actualSize = value * sizeMap[unit]

    if ((cumulativeSize + actualSize) < addedSegment) {
      cumulativeSize += actualSize
      newFormattedSegments.push({ unit, value })
    } else if ((cumulativeSize + actualSize) === addedSegment) return {
      isAdded: false,
      status: 'info',
      message: 'Divider in unison with another existing divider',
    }
    else {
      const firstSeg = ((addedSegment - cumulativeSize) / sizeMap[unit])
      const secondSeg = ((cumulativeSize + actualSize - addedSegment) / sizeMap[unit])
      newFormattedSegments.push({ unit, value: firstSeg }, { unit, value: secondSeg }, ...segments.slice(i + 1))
      break
    }
  }
  return {
    isAdded: true,
    status: 'success',
    payload: newFormattedSegments
  }
}

export function extractValueAndUnit(sizeString: string, fixAmount: number = -1): { size: number, unit: SizeUnit } {
  let size = +[...sizeString.match(/[+-]?([0-9]*[.])?[0-9]+/) || []][0]
  if (isNaN(size)) return { size: 0, unit: 'px' }
  size = fixAmount !== -1
    ? formatNumber(size, fixAmount)
    : formatNumber(size)
  const unit = ([...sizeString.match(/(v[hw])|(px)|(fr)|(%)/) || []][0] || 'px') as SizeUnit
  return { size, unit }
}

export function formatNumber(val: number, maxFixedAmount: number = 10): number {
  if (val % 1 === 0) return val
  let divider = 1
  let fixedAmount = 0
  const fixedVal = +val.toFixed(maxFixedAmount)
  for (let i = 0; i < maxFixedAmount; i++) {
    if (fixedVal % divider === 0) return +fixedVal.toFixed(fixedAmount)
    fixedAmount++
    divider /= 10
  }
  return +val.toFixed(maxFixedAmount)
}

export function objectRecursiveUpdate(obj: {
  [key: string]: any
}, updates: any): any {
  for (const key in updates) {
    const updateValue = updates[key]
    if (typeof updateValue === 'undefined') {
      delete obj[key]
    } else if (Array.isArray(obj[key]) || typeof obj[key] === 'undefined' ||
      (!Array.isArray(updateValue) && !(updateValue instanceof Object))) {
      obj[key] = updateValue
    } else objectRecursiveUpdate(obj[key], updateValue)
  }
}


export function getAbsoluteRectStyle(props: {
  section: WapSection<SectionType>
  selectedSection: WapSection<SectionType> | null
  hoveredSection: WapSection<SectionType> | null
  rect: {
    top: number
    left: number
    height: number
    width: number
  }
  borders: {
    borderTop: boolean
    borderBottom: boolean
    borderLeft: boolean
    borderRight: boolean
    borderBlock: boolean
    borderInline: boolean
  }

}): CSSProperties {
  const { section, selectedSection, hoveredSection, rect, borders } = props
  const styles: CSSProperties = {
    borderStyle: selectedSection?.id === section.id || hoveredSection?.id === section.id
      ? 'solid'
      : 'none',
    borderWidth: selectedSection?.id === section.id || hoveredSection?.id === section.id
      ? '1px'
      : '0',
    borderColor: section.isGlobal
      ? lightGreen['A700']
      : blue['A700'],
    backgroundColor: section.isGlobal &&
      section.id !== selectedSection?.id
      && hoveredSection?.id === section.id
      ? lightGreen['A700'] + '1f'
      : 'none',
  }
  const { borderBlock, borderBottom, borderInline, borderLeft, borderRight, borderTop } = borders
  styles.top = rect.top + 'px'
  styles.left = rect.left + 'px'
  styles.height = rect.height + 'px'
  styles.width = rect.width + 'px'
  if (!borderBlock) styles.borderBlock = 'none'
  else if (!borderTop) styles.borderTop = 'none'
  else if (!borderBottom) styles.borderBottom = 'none'
  if (!borderInline) styles.borderInline = 'none'
  else if (!borderLeft) styles.borderLeft = 'none'
  else if (!borderRight) styles.borderRight = 'none'

  return styles
}

export function getAbsoluteSize(totalSize: number, segments: string[], absoluteSegments?: number[]) {
  const totalUnits: { [K in SizeUnit]: number } = {
    fr: 0,
    '%': 0,
    px: 0,
    vh: 0,
    vw: 0
  }
  const absoluteSizes: { size: number, unit: SizeUnit }[] = []
  segments.forEach((seg, idx) => {
    const formattedSeg = seg.trim()
    if (formattedSeg.includes('minmax') && absoluteSegments) {
      totalUnits.px += absoluteSegments[idx]
      absoluteSizes.push({ size: absoluteSegments[idx], unit: 'px' })
    } else {
      const { size, unit } = extractValueAndUnit(formattedSeg)
      totalUnits[unit] += size
      absoluteSizes.push({ size, unit })
    }
  })

  const percentSize = formatNumber(+(totalSize / 100))
  const vhSize = window.innerHeight / 100
  const vwSize = window.innerWidth / 100
  const frSize = totalUnits.fr
    ? formatNumber((totalSize
      - totalUnits.px
      - totalUnits["%"] * percentSize
      - totalUnits.vh * vhSize
      - totalUnits.vw * vwSize
    ) / totalUnits.fr)
    : 0

  const sizeMap: { [K in SizeUnit]: number } = {
    fr: frSize,
    '%': percentSize,
    px: 1,
    vw: vwSize,
    vh: vhSize
  }

  const cumulativeSizes: number[] = []
  const formattedAbsoluteSizes = absoluteSizes.map(({ size, unit }, idx) => {
    const formattedSize = size * sizeMap[unit]
    cumulativeSizes.push((idx === 0 ? 0 : cumulativeSizes[idx - 1]) + formattedSize)
    return formattedSize
  })

  // console.log(`totalUnits, sizeMap:`, totalUnits, sizeMap)
  return { totalUnits, sizeMap, cumulativeSizes, absoluteSizes: formattedAbsoluteSizes }
}

export function getFormattedRect(props: {
  section: WapSection<SectionType>
  sectionRef: HTMLElement
  containerSize: { x: number, y: number, width: number, height: number }
  headerSizes?: { [T in Orientation]: number[] },
  bp: number
}) {
  const { section, sectionRef, containerSize, headerSizes, bp } = props
  const { y, x, width: w, height: h } = sectionRef.getBoundingClientRect()
  const rect = {
    top: y, left: x, height: h, width: w,
  }
  const borders = {
    borderTop: true,
    borderBottom: true,
    borderLeft: true,
    borderRight: true,
    borderBlock: true,
    borderInline: true
  }
  const { y: contY, x: contX, width: contW, height: contH } = containerSize
  const gridLayout = {
    rowIdxs: [-1, -1] as [number, number],
    colIdxs: [-1, -1] as [number, number],
    colSizes: [] as number[],
    colCumulativeSizes: [] as number[],
    rowSizes: [] as number[],
    rowCumulativeSizes: [] as number[]
  }
  let colSizes: number[] = []
  let colCumulativeSizes: number[] = []
  let rowSizes: number[] = []
  let rowCumulativeSizes: number[] = []

  const { gridTemplateCols, gridTemplateRows } = section
  const isYGrid = gridTemplateRows.length > 1
  const isXGrid = gridTemplateCols.length > 1

  if (isXGrid) {
    const colsAbsoluteSize = getAbsoluteSize(w, gridTemplateCols(bp), headerSizes?.cols)
    colSizes = colsAbsoluteSize.absoluteSizes
    colCumulativeSizes = colsAbsoluteSize.cumulativeSizes
    gridLayout.colSizes = [...colSizes]
    gridLayout.colCumulativeSizes = [...colCumulativeSizes]
    gridLayout.colIdxs = [0, colSizes.length - 1]
  }
  if (isYGrid) {
    const rowsAbsoluteSize = getAbsoluteSize(h, gridTemplateRows(bp), headerSizes?.rows)
    rowSizes = rowsAbsoluteSize.absoluteSizes
    rowCumulativeSizes = rowsAbsoluteSize.cumulativeSizes
    gridLayout.rowSizes = [...rowSizes]
    gridLayout.rowCumulativeSizes = [...rowCumulativeSizes]
    gridLayout.rowIdxs = [0, rowSizes.length - 1]
  }

  if (y < contY) { // if element is above container
    if (y + h < contY) return { display: false }
    rect.top = contY
    rect.height = h - (contY - y)
    borders.borderTop = false

    if (isYGrid) {
      const deltaFromTop = contY - y
      gridLayout.rowCumulativeSizes = gridLayout.rowCumulativeSizes.map(row => row - deltaFromTop)
      const idx = gridLayout.rowCumulativeSizes.findIndex(row => row > 0)
      gridLayout.rowIdxs[0] = idx
      gridLayout.rowSizes[idx] = gridLayout.rowCumulativeSizes[0]
      gridLayout.rowCumulativeSizes = gridLayout.rowCumulativeSizes.slice(idx)
      gridLayout.rowSizes = gridLayout.rowSizes.slice(idx)
    }
  }

  if (y + h > contY + contH) { // if element is bellow container
    if (y > contY + contH) return { display: false }
    rect.height = h - (h + y - (contY + contH))
    borders.borderBottom = false
    if (isYGrid) {
      const idx = colCumulativeSizes.findIndex(col => col + y >= contY + contH)
      const absoluteStartIdx = gridLayout.rowIdxs[0]
      const deltaToSubtract = y + colCumulativeSizes[idx] - contY - contH
      gridLayout.rowSizes[idx - absoluteStartIdx] -= deltaToSubtract
      gridLayout.rowSizes.splice(idx - absoluteStartIdx + 1)
    }
  }

  if (x < contX) { // if elements is left of container
    if (x + w < contX) return { display: false }
    borders.borderLeft = false
    rect.left = contX
    rect.width = w - (contX - x)

    if (isXGrid) {
      const deltaFromLeft = contX - x
      gridLayout.colCumulativeSizes = gridLayout.colCumulativeSizes.map(col => col - deltaFromLeft)
      const idx = gridLayout.colCumulativeSizes.findIndex(col => col >= 0)
      if (idx === -1) console.log('Error!')
      gridLayout.colIdxs[0] = idx
      gridLayout.colSizes[idx] = gridLayout.colCumulativeSizes[idx]
      gridLayout.colSizes = gridLayout.colSizes.slice(idx)
      gridLayout.colCumulativeSizes = gridLayout.colCumulativeSizes.slice(idx)
    }
  }

  if (x + w > contX + contW) { // if element is right of container
    if (x > contX + contW) return { display: false }
    rect.width = w - (w + x - (contX + contW))
    borders.borderRight = false

    if (isXGrid) {
      const idx = colCumulativeSizes.findIndex(col => x + col >= contX + contW)
      const absoluteStartIdx = gridLayout.colIdxs[0]
      const deltaToSubtract = x + colCumulativeSizes[idx] - contX - contW
      gridLayout.colIdxs[1] = idx
      gridLayout.colSizes[idx - absoluteStartIdx] -= deltaToSubtract
      gridLayout.colSizes.splice(idx - absoluteStartIdx + 1)
    }
  }

  if (x < contX && x + w > contX + contW) { // if element is covering container horizontally
    rect.left = contX
    rect.width = contW
    borders.borderInline = false
  }
  if (y < contY && y + h > contY + contH) { // if element is covering container vertically
    rect.top = contY
    rect.height = contH
    borders.borderBlock = false
  }


  return {
    display: true,
    calc: {
      rect,
      borders
    },
    gridLayout
  }
}

export function getGridHeaders(props:
  {
    bp: number,
    container: WapContainerEl,
    croppedGrid: DOMGridLayout,
    croppedGridComparison: DOMGridLayout,
    orientation: Orientation,
    absoluteSizes: number[],
    sizeMap: SizeMap
  }) {
  const { bp, container, sizeMap, croppedGrid, croppedGridComparison, orientation } = props
  const containerGridValues = orientation === 'cols'
    ? container.gridColsLayout(bp)
    : container.gridRowsLayout(bp)
  const modifiedSizes = orientation === 'cols'
    ? croppedGrid.colSizes
    : croppedGrid.rowSizes
  const comparisonSizes = orientation === 'cols'
    ? croppedGridComparison.colSizes
    : croppedGridComparison.rowSizes
  const idxs = orientation === 'cols'
    ? croppedGrid.colIdxs
    : croppedGrid.rowIdxs
  const template: string[] = []
  for (let i = 0; i < modifiedSizes.length; i++) {
    const diff = modifiedSizes[i] - comparisonSizes[i]
    if (!diff) {
      template.push(WapContainerEl.translateGrideCellSizeToString(containerGridValues[i]))
    }
    const globalIdx = i + idxs[0]
    const { unit, value } = containerGridValues[globalIdx]
    const newVal = value + diff / sizeMap[unit]
    template.push(WapContainerEl.translateGrideCellSizeToString({
      ...containerGridValues[i],
      value: newVal
    }))
  }
  return template
}

export function getAbsoluteGridSizes(sizes: GridCellSize[], sizeMap: SizeMap) {
  return sizes.map(size => {
    if (size.minmax) {
      return size.minmax.min.value * sizeMap[size.minmax.min.unit]
    }
    return size.value * sizeMap[size.unit]

  })
}

export function getElementRefById(pageRefMap: PageRefMap, id: string) {
  for (let sectionId in pageRefMap.sections) {
    const currMap = pageRefMap.sections[id]
    if (sectionId === id) return {map: currMap, breadcrumbs: [sectionId]}
    const ref = getElementRefDeepSearch(currMap, id,[])
    if (ref) return {...ref, breadcrumbs: [sectionId, ...ref.breadcrumbs]}
  }
  return null
}

function getElementRefDeepSearch(map: RefMap, id: string, breadCrumbs: string[]): { map: RefMap, breadcrumbs: string[] } | null {
  if (!map) debugger
  if (!map.children) return null
  for (let elId in (map.children)) {
    if (elId === id) return {
      map: map.children[id],
      breadcrumbs: [elId]
    }
    const ref = getElementRefDeepSearch(map.children[elId], id, breadCrumbs)
    if (ref) return {...ref, breadcrumbs:[elId,...ref.breadcrumbs]}
  }
  return null
}

export function getElUnderMouse(wap: Wap, page: WapPage<PageType>, pageRefMap: PageRefMap, ev: React.MouseEvent | MouseEvent) {
  const { clientX: x, clientY: y } = ev
  for (let sectionId in page.sections) {
    const section = wap.sections[sectionId]
    const sectionRef = getElementRefById(pageRefMap, sectionId)?.map?.ref || null
    if (!sectionRef || !isMouseOverRef(sectionRef, { x, y })) continue
    const el = getElUnderMouseDeepSearch(section, pageRefMap, { x, y })
    if (el) return el
  }
  return null
}

function getElUnderMouseDeepSearch(currEl: WapElement<HtmlTags> | WapContainerEl, pageRefMap: PageRefMap, { x, y }: { x: number, y: number }): WapElement<HtmlTags> | WapContainerEl | null {
  const currRefObj = getElementRefById(pageRefMap, currEl.id)?.map || null
  if (!currRefObj || !isMouseOverRef(currRefObj.ref!, { x, y })) return null
  if (currEl instanceof WapContainerEl && currEl.layers.length) {
    for (let childId in currEl.layers) {
      const childEl = currEl.items[childId]
      const res = getElUnderMouseDeepSearch(childEl, pageRefMap, { x, y })
      if (res) return childEl
    }
  }
  return currEl
}

function isMouseOverRef(ref: HTMLElement, { x, y }: { x: number, y: number }) {
  const { left, top, width, height } = ref.getBoundingClientRect()
  return x >= left && y >= top && x <= width + left && y <= height + top
}

export function getMultipliers(num: number) {
  if (num === 1 || !num) return [[num || 0, num || 0]] as [number, number][]
  const mults: [number, number][] = []
  const reverseMults: [number, number][] = []
  for (let i = 1; i <= Math.sqrt(num); i++) {
    const div = num / i
    if (div !== parseInt('' + div)) continue
    mults.push([i, div])
    if (i !== div) reverseMults.unshift([div, i])
  }
  return [...mults, ...reverseMults]
}