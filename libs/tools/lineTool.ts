/*
 * @Date: 2022-02-24 15:58:06
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-11-03 16:09:22
 * @Description: file content
 */

import P5BaseTool, { P5ToolAnnotation } from './baseTool'
import P5 from 'p5'
import { distanceBetween } from '../utils'

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
                sk.text(
                    distanceBetween(startPoint, endPoint).toFixed(1),
                    (endPoint[0] - startPoint[0]) / 2 + (this.options?.strokeWeight || 5) + startPoint[0],
                    (endPoint[1] - startPoint[1]) / 2 + (this.options?.strokeWeight || 5) + startPoint[1] + annotation.options.textSize!,
                )
            }
        }
    }
}

export default LineTool