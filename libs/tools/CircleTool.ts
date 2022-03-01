/*
 * @Date: 2022-02-24 15:58:06
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-03-01 23:32:34
 * @Description: file content
 */

import P5BaseTool, { P5BaseAnnotation } from './baseTool'
import P5 from 'p5'
import { CursorPoint, distanceBetween } from '../utils/index'

interface CircleToolAnnotation extends P5BaseAnnotation<'CircleTool'> {

}

class CircleTool extends P5BaseTool<CircleToolAnnotation> {
    static toolName = 'CircleTool'
    
    constructor (annotations?: CircleToolAnnotation[]) {
        super('CircleTool', annotations)
    }

    public getPluginOrigin(annotation: P5BaseAnnotation<string>): CursorPoint {
        if (annotation.startPoint && annotation.endPoint) {
            const distance = distanceBetween(annotation.startPoint, annotation.endPoint)
            return [annotation.startPoint[0] + distance - this.pluginItemWH / 2 + annotation.translateX, annotation.startPoint[1] + distance - this.pluginItemWH / 2 + annotation.translateY]
        }

        return [0, 0]
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
        this.reverseStartEndPointByOrder()
    }

    public pointInAnnotation(point: CursorPoint, annotation: CircleToolAnnotation): boolean {
        if (annotation.startPoint && annotation.endPoint) {
            const startPoint = [annotation.startPoint[0] + annotation.translateX, annotation.startPoint[1] + annotation.translateY]
            const originDistance = distanceBetween(annotation.startPoint, annotation.endPoint)
            const distance = distanceBetween(startPoint as CursorPoint, point)
            if (distance < originDistance) {
                return true
            }
            const origin = this.getPluginOrigin(annotation)
            if (
                point[0] > startPoint[0] &&
                point[0] < origin[0] + (this.pluginItemMargin + this.pluginItemWH) * this.pluginsCount &&
                point[1] > startPoint[1] + originDistance - this.pluginItemWH / 2 &&
                point[1] < origin[1] + this.pluginItemWH
            ) {
                return true
            }
        }
        return false
    }

    public draw(sk: P5): void {
        for (const annotation of this.annotations || []) {
            const startPoint = annotation.startPoint
            const endPoint = annotation.endPoint

            if (!startPoint || !endPoint) {
                return
            }

            super.configAnnotation(sk, annotation)
            
            sk.circle(
                startPoint[0] + annotation.translateX,
                startPoint[1] + annotation.translateY,
                distanceBetween(startPoint, endPoint) * 2
            )
        }
    }
}

export default CircleTool