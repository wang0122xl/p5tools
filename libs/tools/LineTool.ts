/*
 * @Date: 2022-02-24 15:58:06
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-03-01 13:11:46
 * @Description: file content
 */

import P5BaseTool, { P5BaseAnnotation } from './baseTool'
import P5 from 'p5'

interface LineToolAnnotation extends P5BaseAnnotation<'LineTool'> {
    
}

class LineTool extends P5BaseTool<LineToolAnnotation> {
    static toolName = 'LineTool'
    
    constructor (annotations?: LineToolAnnotation[]) {
        super('LineTool', annotations)
    }

    public draw(sk: P5): void {
        for (const annotation of this.annotations || []) {
            const startPoint = annotation.startPoint
            const endPoint = annotation.endPoint

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
        }
    }
}

export default LineTool