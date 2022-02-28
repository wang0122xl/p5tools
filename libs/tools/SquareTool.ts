/*
 * @Date: 2022-02-24 15:58:06
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-02-28 20:13:29
 * @Description: file content
 */

import BaseTool, { BaseAnnotation } from './baseTool/BaseTool'
import P5 from 'p5'

interface CircleToolAnnotation extends BaseAnnotation<'SquareTool'> {

}

class SquareTool extends BaseTool<CircleToolAnnotation> {
    static toolName = 'SquareTool'
    
    constructor (annotations?: CircleToolAnnotation[]) {
        super('SquareTool', annotations)
    }

    public draw(sk: P5): void {
        for (const annotation of this.annotations || []) {
            const startPoint = annotation.startPoint
            const endPoint = annotation.endPoint
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