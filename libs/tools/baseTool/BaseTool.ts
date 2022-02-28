/*
 * @Date: 2022-02-24 15:58:06
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-02-28 20:20:22
 * @Description: 基础工具
 */

import moment from "moment"
import P5, { THE_STYLE } from 'p5'
import { distanceBetween } from '../../utils/index'
import type { CursorPoint } from '../../utils/index'

export interface ToolOptions {
    strokeWeight?: number
    strokeColor?: string
    strokeAlpha?: number
    fillColor?: string
    textSize?: number
    textStyle?: THE_STYLE
}

export interface BaseAnnotation<Name = string> {
    title?: string // 标题
    date?: moment.Moment // 更新日期
    remark?: string // 备注
    belong: Name // 所属工具
    startPoint?: CursorPoint
    endPoint?: CursorPoint
    options?: ToolOptions // p5 绘图所需的选项
}
class BaseTool<
    AnnotationType extends BaseAnnotation
> {
    static readonly toolName: string

    public annotations: AnnotationType[] = []
    public name: AnnotationType['belong']
    public editingAnnotation?: AnnotationType
    public options?: ToolOptions

    constructor (
        name: AnnotationType['belong'],
        annotations?: AnnotationType[]
    ) {
        this.name = name
        annotations && (this.annotations = annotations)
    }

    /**
     * @description: 根据标注的option设置sk
     * @param {AnnotationType} anno
     * @return {*}
     */    
    public configAnnotation(sk: P5, anno: AnnotationType): void {
        const options = anno.options
        console.log(options?.strokeColor)
        if (options?.strokeColor) {
            const color = sk.color(options.strokeColor)
            const alpha = sk.map(options.strokeAlpha || 1, 0, 1, 0, 255)

            color.setAlpha(alpha)
            sk.stroke(color)
        }
        if (options?.fillColor) {
            sk.fill(options.fillColor)
        } else {
            sk.noFill()
        }
        options?.textSize && sk.textSize(options.textSize)
        options?.strokeWeight && sk.strokeWeight(options.strokeWeight)
        options?.textStyle && sk.textStyle('bold')
    }

    /**
     * @description: 创建初始化的标注信息
     * @param 
     * @return BaseAnnotation
     */    
    public getInitialAnnotation(): BaseAnnotation {
        return {
            belong: this.name,
            options: this.options,
            date: moment()
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
     * @description: p5 draw
     * @param {P5} sk
     * @return {*}
     */    
    public draw(sk: P5) {
        
    }

    /**
     * @description: p5 touchStarted
     * @param {P5} sk
     * @return {*}
     */    
    public touchStarted(sk: P5) {
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
}

export default BaseTool