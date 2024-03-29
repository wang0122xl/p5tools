/*
 * @Date: 2022-02-24 15:58:06
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-12-08 16:22:55
 * @Description: 基础工具
 */

import P5, { THE_STYLE } from 'p5'
import { distanceBetween } from '../../utils/index'
import type { CursorPoint } from '../../utils/index'
import emitter, { EMITTER_ANNOTATION_INFO_UPDATED } from "../../utils/emitter"
import P5ToolsManager from '../../manager'

export interface P5ToolOptions {
    strokeWeight?: number
    strokeColor?: string
    strokeAlpha?: number
    fillColor?: string
    textSize?: number
    textStyle?: THE_STYLE
}

export interface P5ToolBaseInfo<Other = any> {
    title?: string // 标题
    time?: number // 更新时间的时间戳
    remark?: string // 备注
    others?: Other
}
export interface P5ToolAnnotation<Name = string, OtherType = any> {
    info: P5ToolBaseInfo<OtherType>
    belong: Name // 所属工具
    startPoint?: CursorPoint
    endPoint?: CursorPoint
    options: P5ToolOptions // p5 绘图所需的选项
    translateX: number
    translateY: number
    scale: number
    transformedStartPoint: () => CursorPoint | undefined
    transformedEndPoint: () => CursorPoint | undefined
    remove: () => void
}

export type P5ToolGetInfo = (tool: P5BaseTool<any>) => Promise<P5ToolBaseInfo>

class P5BaseTool<
    AnnotationType extends P5ToolAnnotation,
    ToolState extends Record<string, any> = any
> {
    static readonly toolName: string

    public manager!: P5ToolsManager

    public annotations: AnnotationType[] = []
    public name: AnnotationType['belong']
    public editingAnnotation?: AnnotationType
    public options?: P5ToolOptions
    public pluginsCount: number = 0

    public pluginItemWH: number = 20
    public pluginItemMargin: number = 5

    public state: ToolState

    /** 加载的图片 */
    public loadedImage?: P5.Image

    public customConfigAnnotation?: (tool: P5BaseTool<any>, anno: AnnotationType) => void

    /**
     * @description: 获取文字的回调函数
     * @param {*} Promise
     * @return {*}
     */    
     public getToolInfo: P5ToolGetInfo = () => {
         return Promise.resolve({
             time: new Date().getTime()
         })
     }

    constructor (
        name: AnnotationType['belong'],
        annotations?: AnnotationType[],
        initialState?: ToolState
    ) {
        this.name = name
        annotations && (this.annotations = annotations)
        this.state = (initialState || {}) as ToolState
    }

    /**
     * @description: tool从enabled状态退出时调用
     * @return {*}
     */    
    public turnToDisabled () {
        console.info(`disabled: ${this.name}`)
    }

    public transformValue = (v: number) => {
        return v * this.manager.scale
    }

    /**
     * @description: 获取原始坐标转换后的新坐标位置，scale, translate, etc..
     * @param {CursorPoint} point
     * @return {*}
     */    
    public transformPoint = (point: CursorPoint) => {
        return [
            this.transformValue(point[0]) + this.manager.translate[0],
            this.transformValue(point[1]) + this.manager.translate[1]
        ] as CursorPoint
    }

    /**
     * @description: 获取画布坐标再未转换前的原始位置
     * @param {CursorPoint} point
     * @return {*}
     */    
    public restorePoint = (point: CursorPoint) => {
        const restoredPoint = [
            (point[0] - this.manager.translate[0]) / this.manager.scale,
            (point[1] - this.manager.translate[1]) / this.manager.scale
        ] as CursorPoint

        let offsetH = 0
        let offsetV = 0
        if (this.manager.hflip) {
            offsetH = restoredPoint[0] * 2
        }
        if (this.manager.vflip) {
            offsetV = restoredPoint[1] * 2
        }

        return [
            restoredPoint[0] - offsetH,
            restoredPoint[1] - offsetV
        ] as CursorPoint
    }

    /**
     * @description: 根据标注的option设置sk
     * @param {AnnotationType} anno
     * @return {*}
     */    
    public configAnnotation(sk: P5, anno: AnnotationType): void {
        const options = anno.options
        if (options?.strokeColor) {
            const color = sk.color(options.strokeColor)
            const alpha = sk.map(options.strokeAlpha || 1, 0, 1, 0, 255)

            color.setAlpha(alpha)
            sk.stroke(color)
        } else {
            sk.noStroke()
        }
        if (options?.fillColor) {
            sk.fill(options.fillColor)
        } else {
            sk.noFill()
        }
        options?.textSize && sk.textSize(options.textSize * this.manager.scale)
        options?.strokeWeight && sk.strokeWeight(options.strokeWeight * this.manager.scale)
        options?.textStyle && sk.textStyle(options.textStyle)

        this.customConfigAnnotation?.(this, anno)
    }

    /**
     * @description: 获取初始化的标注设置信息
     * @param {*}
     * @return {*}
     */    
    public getInitialOptions(): P5ToolOptions {
        return {
            textSize: 12,
            strokeColor: '#111',
            strokeWeight: 1,
        }
    }
    /**
     * @description: 获取初始化的标注信息
     * @param 
     * @return BaseAnnotation
     */    
    public getInitialAnnotation(): P5ToolAnnotation {
        const self = this
        return {
            info: {
                time: new Date().getTime(),
            },
            remove: function() {
                self.annotations.splice(self.annotations.indexOf(this as any), 1)
            },
            belong: this.name,
            options: {...this.getInitialOptions(), ...this.options},
            translateX: 0,
            translateY: 0,
            scale: 1,
            transformedStartPoint: function () {
                if (!this.startPoint) {
                    return undefined
                }
                return [
                    self.transformValue(this.startPoint[0] + this.translateX) + self.manager.translate[0],
                    self.transformValue(this.startPoint[1] + this.translateY) + self.manager.translate[1]
                ] as CursorPoint
            },
            transformedEndPoint: function () {
                if (!this.endPoint) {
                    return undefined
                }
                return [
                    self.transformValue(this.endPoint[0] + this.translateX) + self.manager.translate[0],
                    self.transformValue(this.endPoint[1] + this.translateY) + self.manager.translate[1]
                ] as CursorPoint
            }
        }
    }

    /**
     * @description: 验证annotation是否合法（防抖）
     * @param {AnnotationType} annotation
     * @return {*}
     */    
    public validateAnnotation(annotation: AnnotationType) {
        if (distanceBetween(annotation.startPoint!, annotation.endPoint!) < 2) {
            return false
        }
        return true
    }

    /**
     * @description: p5 preload
     * @param {P5} sk
     * @return {*}
     */    
    public preload(sk: P5) {

    }

    /**
     * @description: p5 setup
     * @param {P5} sk
     * @return {*}
     */    
    public setup(sk: P5) {

    }

    /**
     * @description: p5 mouseMoved
     * @param {P5} sk
     * @return {*}
     */    
     public mouseMoved(sk: P5) {
         
    }

    /**
     * @description: p5 draw
     * @param {P5} sk
     * @return {*}
     */    
    public draw(sk: P5) {
        
    }

    /**
     * @description: p5 touchStarted
     * @param {P5} sk
     * @param {any} event
     * @return {*}
     */    
    public touchStarted(sk: P5) {
        this.editingAnnotation = {
            ...this.getInitialAnnotation(),
            startPoint: this.restorePoint([sk.mouseX, sk.mouseY])
        } as AnnotationType
        this.annotations.push(this.editingAnnotation)
    }

    /**
     * @description: p5 touchMoved
     * @param {P5} sk
     * @return {*}
     */    
    public touchMoved(sk: P5) {
        if (!this.editingAnnotation) {
            // this.touchEnded(sk)
        } else {
            this.editingAnnotation!.endPoint = this.restorePoint([sk.mouseX, sk.mouseY])
        }
    }

    /**
     * @description: p5 touchEnded
     * @param {P5} sk
     * @return {*}
     */    
    public touchEnded(sk: P5) {
        if (!this.editingAnnotation) {
            return
        }
        this.editingAnnotation!.endPoint = this.restorePoint([sk.mouseX, sk.mouseY])
        // 当前编辑的annotation非法，删除此annotation
        if (!this.validateAnnotation(this.editingAnnotation!)) {
            this.annotations?.pop()
            this.editingAnnotation = undefined
        } else {
            this.getToolInfo(this).then(info => {
                if (this.editingAnnotation) {
                    this.editingAnnotation.info = info
                    emitter.emit(EMITTER_ANNOTATION_INFO_UPDATED)
                }
            }).catch(e => {
                console.warn(e)
            }).finally(() => {
                this.editingAnnotation = undefined
            })
        }
    }

    /**
     * @description: 翻转后，重置文字方向
     * @return {*}
     */    
    public resetTextTransform(sk: P5, point: CursorPoint) {
        sk.resetMatrix()
        if (this.manager.hflip) {
            sk.translate(-point[0] * 2 * this.manager.scale, 0)
        }
        if (this.manager.vflip) {
            sk.translate(0, -point[1] * 2 * this.manager.scale)
        }
    }

    /**
     * @description: 反转起始和终止点，使起始点永远在左上角
     * @param {*}
     * @return {*}
     */    
    public reverseStartEndPointByOrder() {
        if (this.editingAnnotation && this.editingAnnotation.startPoint && this.editingAnnotation.endPoint) {
            const [startX, startY] = this.editingAnnotation.startPoint
            const [endX, endY] = this.editingAnnotation.endPoint
            this.editingAnnotation.startPoint = [Math.min(startX, endX), Math.min(startY, endY)]
            this.editingAnnotation.endPoint = [Math.max(startX, endX), Math.max(startY, endY)]
        }
    }

    /**
     * @description: 判断点坐标是否在annotation范围内
     * @param {CursorPoint} point
     * @param {P5ToolAnnotation} annotation
     * @return {*}
     */    
    public pointInAnnotation(point: CursorPoint, annotation: P5ToolAnnotation): boolean {
        return false
    }

    /**
     * @description: 获取annotation对应的插件视图起始位置
     * @param {P5ToolAnnotation} annotation
     * @return {*}
     */    
    public getPluginOrigin(annotation: P5ToolAnnotation): CursorPoint {
        return annotation.startPoint || [0, 0]
    }

    public pointInPluginLayer(point: CursorPoint, annotation: P5ToolAnnotation<any>) {
        const origin = this.getPluginOrigin(annotation)
        if (
            point[0] > origin[0] &&
            point[0] < origin[0] + (this.pluginItemWH + this.pluginItemMargin) * this.pluginsCount &&
            point[1] > origin[1] &&
            point[1] < origin[1] + this.pluginItemWH
        ) {
            return true
        }
        return false
    }
}

export default P5BaseTool