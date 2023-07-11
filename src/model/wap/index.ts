import { HtmlInput, HtmlContainer, HtmlSection, HtmlMedia, HtmlAction, Text, StylesMap, WapPageType, WapSectionType, OperationStatusObject, WapScreenType, WapPageBreakpoint, WapAction, WapActionLogs, WapSizeUnit, WapGridCellSizeFormat, WapGridCellSize, WapGridLayout, WapSizeMap } from "./misc"
import { Page } from "./page"
import { Section } from "./section"
import { Element } from "./element"
import { Container } from "./container"
import { WapText } from "./text"
import { WapImage } from "./img"
import { WapVideo } from "./video"
import { WapIFrame } from "./iframe"
import { WapMenu } from "./menu"
import { WapObject } from "./wap"

export type TextTags = Text
export type HtmlActionTags = HtmlAction
export type HtmlMediaTags = HtmlMedia
export type HtmlSectionTags = HtmlSection
export type HtmlContainerTags = HtmlContainer
export type HtmlInputTags = HtmlInput
export type HtmlTags = TextTags | HtmlActionTags | HtmlMediaTags | HtmlSectionTags | HtmlContainerTags | HtmlInputTags
export type PageType = WapPageType
export type ScreenType = WapScreenType
export type SectionType = WapSectionType
export type PageBreakpoint = WapPageBreakpoint

export interface Styles extends StylesMap { }
export type SizeUnit = WapSizeUnit
export type SizeMap = WapSizeMap
export interface GridCellSizeFormat extends WapGridCellSizeFormat { }
export interface GridCellSize extends WapGridCellSize { }
export interface GridLayout extends WapGridLayout { }

export type OperationStatus<T extends string, K = any> = OperationStatusObject<T, K>
export interface Action extends WapAction { }
export interface ActionLogs extends WapActionLogs { }

export class Wap extends WapObject { }
export class WapPage<T extends PageType> extends Page<T> { }
export class WapSection<T extends SectionType> extends Section<T> { }
export class WapElement<T extends HtmlTags> extends Element<T> { }
export class WapContainerEl extends Container { }
export class WapTextEl<T extends TextTags> extends WapText<T> { }
export class WapImageEl extends WapImage { }
export class WapVideoEl extends WapVideo { }
export class WapIFrameEl extends WapIFrame { }
export class WapMenuEl extends WapMenu { }

// export class WapLayoutEl extends WapContainerEl {
//     constructor(sectionId: string) {
//         super(sectionId)
//     }
// }