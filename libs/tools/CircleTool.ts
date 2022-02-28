/*
 * @Date: 2022-02-24 15:58:06
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-02-28 20:12:44
 * @Description: file content
 */

import BaseTool, { BaseAnnotation } from './baseTool/BaseTool'
import P5 from 'p5'
import { distanceBetween } from '../utils/index'

interface CircleToolAnnotation extends BaseAnnotation<'CircleTool'> {

}

class CircleTool extends BaseTool<CircleToolAnnotation> {
    static toolName = 'CircleTool'
    
    constructor (annotations?: CircleToolAnnotation[]) {
        super('CircleTool', annotations)
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
                startPoint[0],
                startPoint[1],
                distanceBetween(startPoint, endPoint) * 2
            )
        }
    }
}

export default CircleTool