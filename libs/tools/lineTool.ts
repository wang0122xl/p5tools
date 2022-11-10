/*
 * @Date: 2022-02-24 15:58:06
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-11-10 11:59:06
 * @Description: file content
 */

import P5BaseTool, { P5ToolAnnotation } from './baseTool'
import P5 from 'p5'
import { CursorPoint, distanceBetween } from '../utils'

interface LineToolAnnotation extends P5ToolAnnotation<'LineTool'> {
    
}

class LineTool extends P5BaseTool<LineToolAnnotation> {
    static toolName = 'LineTool'
    public showDistance = false
    
    constructor (annotations?: LineToolAnnotation[]) {
        super('LineTool', annotations)
    }

    public draw(sk: P5): void {
        for (const annotation of this.annotations || []) {
            const startPoint = annotation.transformedStartPoint()
            const endPoint = annotation.transformedEndPoint()

            if (!startPoint || !endPoint) {
                return
            }
            
            super.configAnnotation(sk, annotation)

            sk.line(
                startPoint[0],
                startPoint[1],
                endPoint[0],
                endPoint[1]
            )
            sk.textSize(annotation.options.textSize! * this.manager.scale)
            sk.fill(annotation.options.strokeColor!)
            
            if (this.showDistance) {
                sk.push()
                this.resetTextTransform(sk, [
                    (annotation.endPoint![0] - annotation.startPoint![0]) / 2 + (this.options?.strokeWeight || 5) + annotation.startPoint![0],
                    (annotation.endPoint![1] - annotation.startPoint![1]) / 2 + (this.options?.strokeWeight || 5) + annotation.startPoint![1] + annotation.options.textSize!
                ] as CursorPoint)
                sk.text(
                    distanceBetween(startPoint, endPoint).toFixed(1),
                    (endPoint[0] - startPoint[0]) / 2 + startPoint[0],
                    (endPoint[1] - startPoint[1]) / 2 + (this.options?.strokeWeight || 5) * this.manager.scale + startPoint[1] + (this.manager.vflip ? (annotation.options.textSize! * this.manager.scale) * 2 : annotation.options.textSize! * this.manager.scale)
                )
                sk.pop()
            }
        }
    }
}

export default LineTool