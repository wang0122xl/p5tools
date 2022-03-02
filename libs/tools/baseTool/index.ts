/*
 * @Date: 2022-02-24 15:58:06
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-03-02 22:12:11
 * @Description: 基础工具
 */

import moment from "moment"
import P5, { THE_STYLE } from 'p5'
import { distanceBetween } from '../../utils/index'
import type { CursorPoint } from '../../utils/index'
import P5BasePlugin from '../../plugins'
import _ from 'lodash'

export interface P5ToolOptions {
    strokeWeight?: number
    strokeColor?: string
    strokeAlpha?: number
    fillColor?: string
    textSize?: number
    textStyle?: THE_STYLE
}

export interface P5BaseAnnotation<Name = string> {
    title?: string // 标题
    date?: moment.Moment // 更新日期
    remark?: string // 备注
    belong: Name // 所属工具
    startPoint?: CursorPoint
    endPoint?: CursorPoint
    options: P5ToolOptions // p5 绘图所需的选项
    translateX: number
    translateY: number
    scale?: number
}
class P5BaseTool<
    AnnotationType extends P5BaseAnnotation,
    ToolState extends Record<string, any> = any
> {
    static readonly toolName: string

    public annotations: AnnotationType[] = []
    public name: AnnotationType['belong']
    public editingAnnotation?: AnnotationType
    public options?: P5ToolOptions
    public pluginsCount: number = 0

    public pluginItemWH: number = 20
    public pluginItemMargin: number = 5

    public state: ToolState

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
     * @description: 获取文字
     * @param {*} Promise
     * @return {*}
     */    
    public getText: () => Promise<string> = async () => {
        const text = prompt('请输入')
        return text || ''
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
        options?.textSize && sk.textSize(options.textSize)
        options?.strokeWeight && sk.strokeWeight(options.strokeWeight)
        options?.textStyle && sk.textStyle(options.textStyle)
    }

    public getInitialOptions(): P5ToolOptions {
        return {
            textSize: 12,
            strokeColor: '#111',
            strokeWeight: 1
        }
    }
    /**
     * @description: 获取初始化的标注信息
     * @param 
     * @return BaseAnnotation
     */    
    public getInitialAnnotation(): P5BaseAnnotation {
        return {
            belong: this.name,
            options: {...this.getInitialOptions(), ...this.options},
            date: moment(),
            translateX: 0,
            translateY: 0
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
    public touchStarted(sk: P5, event: any) {
        this.editingAnnotation = {
            ...this.getInitialAnnotation(),
            startPoint: [sk.mouseX, sk.mouseY]
        } as AnnotationType
        this.annotations.push(this.editingAnnotation)
    }

    /**
     * @description: p5 touchMoved
     * @param {P5} sk
     * @return {*}
     */    
    public touchMoved(sk: P5) {
        this.editingAnnotation!.endPoint = [sk.mouseX, sk.mouseY]
    }

    /**
     * @description: p5 touchEnded
     * @param {P5} sk
     * @return {*}
     */    
    public touchEnded(sk: P5) {
        this.editingAnnotation!.endPoint = [sk.mouseX, sk.mouseY]
        // 当前编辑的annotation非法，删除此annotation
        if (!this.validateAnnotation(this.editingAnnotation!)) {
            this.annotations?.pop()
            this.editingAnnotation = undefined
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
     * @param {P5BaseAnnotation} annotation
     * @return {*}
     */    
    public pointInAnnotation(point: CursorPoint, annotation: P5BaseAnnotation): boolean {
        return false
    }

    /**
     * @description: 获取annotation对应的插件视图起始位置
     * @param {P5BaseAnnotation} annotation
     * @return {*}
     */    
    public getPluginOrigin(annotation: P5BaseAnnotation): CursorPoint {
        return annotation.startPoint || [0, 0]
    }
}

export default P5BaseTool