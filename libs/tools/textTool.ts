/*
 * @Date: 2022-02-24 15:58:06
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-03-03 20:40:58
 * @Description: file content
 */

import P5BaseTool, { P5ToolAnnotation } from './baseTool'
import P5 from 'p5'
import { CursorPoint } from '../utils'

interface TextToolAnnotation extends P5ToolAnnotation<'TextTool'> {
    textWidth: number
    textHeight: number
}

class TextTool extends P5BaseTool<TextToolAnnotation> {
    static toolName = 'TextTool'

    private async defaultGetToolInfo () {
        const title = prompt('请输入') || ''
        return {
            title,
            time: new Date().getTime()
        }
    }
    
    constructor (annotations?: TextToolAnnotation[]) {
        super('TextTool', annotations)
    }

    public validateAnnotation(annotation: TextToolAnnotation): boolean {
        return true
    }

    public touchEnded(sk: P5): void {
        super.touchEnded(sk)
        if (this.editingAnnotation) {
            this.editingAnnotation.startPoint = this.restorePoint([sk.mouseX, sk.mouseY])
        }
    }


    public getPluginOrigin(annotation: TextToolAnnotation): CursorPoint {
        const startPoint = annotation.transformedStartPoint()

        if (!startPoint) {
            return [0, 0]
        }

        return [
            startPoint[0] - annotation.textWidth / 2,
            startPoint[1] - this.pluginItemWH - annotation.textHeight
        ]
    }

    public pointInAnnotation(point: CursorPoint, annotation: TextToolAnnotation): boolean {
        const startPoint = annotation.transformedStartPoint()
        if (!startPoint) {
            return false
        }
        
        
        const halfTextWidth = annotation.textWidth / 2

        if (
            point[0] > startPoint[0] - halfTextWidth &&
            point[0] < startPoint[0] + halfTextWidth &&
            point[1] > startPoint[1] - annotation.textHeight && 
            point[1] < startPoint[1]
        ) {
            return true
        }

        return this.pointInPluginLayer(point, annotation)
    }

    public draw(sk: P5): void {
        for (const annotation of this.annotations || []) {
            const startPoint = annotation.transformedStartPoint()

            if (!startPoint) {
                return
            }


            super.configAnnotation(sk, annotation)
            sk.noStroke()
            
            const text = annotation.info.title || ''
            const textWidth = sk.textWidth(text)
            annotation.textWidth = textWidth
            const textHeight = sk.textAscent()
            annotation.textHeight = textHeight

            sk.text(
                text,
                startPoint[0] - textWidth / 2,
                startPoint[1]
            )
        }
    }
}

export default TextTool