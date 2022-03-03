/*
 * @Date: 2022-02-24 15:58:06
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-03-03 18:38:47
 * @Description: file content
 */

import P5BaseTool, { P5ToolAnnotation } from './baseTool'
import P5 from 'p5'
import { CursorPoint, distanceBetween } from '../utils/index'

interface CircleToolAnnotation extends P5ToolAnnotation<'CircleTool'> {

}

class CircleTool extends P5BaseTool<CircleToolAnnotation> {
    static toolName = 'CircleTool'

    constructor(annotations?: CircleToolAnnotation[]) {
        super('CircleTool', annotations)
    }

    public getPluginOrigin(annotation: P5ToolAnnotation<string>): CursorPoint {
        const startPoint = annotation.transformedStartPoint()
        const endPoint = annotation.transformedEndPoint()
        if (startPoint && endPoint) {
            const distance = distanceBetween(startPoint, endPoint)
            return [
                startPoint[0] + distance + (annotation.options.strokeWeight || 1) * this.scale / 2,
                startPoint[1] - this.pluginItemWH / 2
            ]
        }

        return [0, 0]
    }

    public pointInAnnotation(point: CursorPoint, annotation: CircleToolAnnotation): boolean {
        const startPoint = annotation.transformedStartPoint()
        const endPoint = annotation.transformedEndPoint()
        if (!startPoint || !endPoint) {
            return false
        }

        const originDistance = distanceBetween(startPoint, endPoint)
        const distance = distanceBetween(startPoint as CursorPoint, point)
        if (distance < originDistance) {
            return true
        }
        return this.pointInPluginLayer(point, annotation)
    }

    public touchEnded(sk: P5): void {
        super.touchEnded(sk)
        if (this.editingAnnotation) {
            const [startX, startY] = this.editingAnnotation.startPoint!
            const distance = distanceBetween(this.editingAnnotation.startPoint!, this.editingAnnotation.endPoint!)
            this.editingAnnotation.endPoint = [
                startX + distance,
                startY
            ]
        }
    }

    public draw(sk: P5): void {
        for (const annotation of this.annotations || []) {
            const startPoint = annotation.transformedStartPoint()
            const endPoint = annotation.transformedEndPoint()

            if (!startPoint || !endPoint) {
                return
            }

            super.configAnnotation(sk, annotation)

            sk.circle(
                startPoint[0],
                startPoint[1],
                distanceBetween(startPoint, endPoint) * 2
            )
        }
    }
}

export default CircleTool