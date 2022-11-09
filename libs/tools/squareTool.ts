/*
 * @Date: 2022-02-24 15:58:06
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-11-09 14:56:08
 * @Description: file content
 */

import P5BaseTool, { P5ToolAnnotation } from './baseTool'
import P5 from 'p5'
import { CursorPoint } from '../utils'

interface SquareToolAnnotation extends P5ToolAnnotation<'SquareTool'> {

}

class SquareTool extends P5BaseTool<SquareToolAnnotation> {
    static toolName = 'SquareTool'
    
    constructor (annotations?: SquareToolAnnotation[]) {
        super('SquareTool', annotations)
    }

    public getPluginOrigin(annotation: P5ToolAnnotation<string>): CursorPoint {
        const startPoint = annotation.transformedStartPoint()
        const endPoint = annotation.transformedEndPoint()
        if (!endPoint || !startPoint) {
            return [0, 0]
        }
        
        const xParams = [startPoint[0], endPoint[0]]
        const yParams = [startPoint[1], endPoint[1]]

        return [
            Math.max(...xParams) + (annotation.options.strokeWeight || 1) * this.manager.scale,
            Math.max(...yParams) - this.pluginItemWH + (annotation.options.strokeWeight || 1) * this.manager.scale / 2
        ]
    }

    public touchEnded(sk: P5): void {
        super.touchEnded(sk)
        this.reverseStartEndPointByOrder()
    }

    public pointInAnnotation(point: CursorPoint, annotation: P5ToolAnnotation<string>): boolean {
        const startPoint = annotation.transformedStartPoint()
        const endPoint = annotation.transformedEndPoint()
        if (!endPoint || !startPoint) {
            return false
        }

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

        return this.pointInPluginLayer(point, annotation)
    }

    public draw(sk: P5): void {
        for (const annotation of this.annotations || []) {
            const startPoint = annotation.transformedStartPoint()
            const endPoint = annotation.transformedEndPoint()
            if (!startPoint || !endPoint) {
                return
            }

            super.configAnnotation(sk, annotation)
            
            sk.quad(
                startPoint[0],
                startPoint[1],
                endPoint[0],
                startPoint[1],
                endPoint[0],
                endPoint[1],
                startPoint[0],
                endPoint[1]
            )

        }
    }
}

export default SquareTool