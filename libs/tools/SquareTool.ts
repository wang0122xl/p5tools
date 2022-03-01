/*
 * @Date: 2022-02-24 15:58:06
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-03-01 23:29:40
 * @Description: file content
 */

import P5BaseTool, { P5BaseAnnotation } from './baseTool'
import P5 from 'p5'
import { CursorPoint } from '../utils'

interface CircleToolAnnotation extends P5BaseAnnotation<'SquareTool'> {

}

class SquareTool extends P5BaseTool<CircleToolAnnotation> {
    static toolName = 'SquareTool'
    
    constructor (annotations?: CircleToolAnnotation[]) {
        super('SquareTool', annotations)
    }

    public getPluginOrigin(annotation: P5BaseAnnotation<string>): CursorPoint {
        if (!annotation.endPoint || !annotation.startPoint) {
            return [0, 0]
        }

        const startPoint = [annotation.startPoint[0] + annotation.translateX, annotation.startPoint[1] + annotation.translateY]
        const endPoint = [annotation.endPoint[0] + annotation.translateX, annotation.endPoint[1] + annotation.translateY]
        const xParams = [startPoint[0], endPoint[0]]
        const yParams = [startPoint[1], endPoint[1]]

        return [
            Math.max(...xParams),
            Math.max(...yParams) - this.pluginItemWH
        ]
    }

    public touchEnded(sk: P5): void {
        super.touchEnded(sk)
        this.reverseStartEndPointByOrder()
    }

    public pointInAnnotation(point: CursorPoint, annotation: P5BaseAnnotation<string>): boolean {
        if (!annotation.startPoint || !annotation.endPoint) {
            return false
        }
        const startPoint = [annotation.startPoint[0] + annotation.translateX, annotation.startPoint[1] + annotation.translateY]
        const endPoint = [annotation.endPoint[0] + annotation.translateX, annotation.endPoint[1] + annotation.translateY]
        const xParams = [startPoint[0], endPoint[0]]
        const yParams = [startPoint[1], endPoint[1]]

        if (
            point[0] < Math.max(...xParams) &&
            point[0] > Math.min(...xParams) &&
            point[1] < Math.max(...yParams) &&
            point[1] > Math.min(...yParams)
        ) {
            return true
        }
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

    // public pointInAnnotation(point: CursorPoint, annotation: P5BaseAnnotation<string>): boolean {
    //     const tPoint = [point[0] - annotation.translateX, point[1] - annotation.translateY]
    //     if (point)
    // }

    public draw(sk: P5): void {
        for (const annotation of this.annotations || []) {
            const startPoint = annotation.startPoint
            const endPoint = annotation.endPoint
            if (!startPoint || !endPoint) {
                return
            }
            super.configAnnotation(sk, annotation)

            sk.quad(
                startPoint[0] + annotation.translateX,
                startPoint[1] + annotation.translateY,
                endPoint[0] + annotation.translateX,
                startPoint[1] + annotation.translateY,
                endPoint[0] + annotation.translateX,
                endPoint[1] + annotation.translateY,
                startPoint[0] + annotation.translateX,
                endPoint[1] + annotation.translateY
            )

        }
    }
}

export default SquareTool