/*
 * @Date: 2022-02-24 15:58:06
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-11-10 14:11:03
 * @Description: file content
 */

import P5BaseTool, { P5ToolAnnotation } from './baseTool'
import P5 from 'p5'
import { degreeBetween } from '../utils/index'

interface ArrowLineToolAnnotation extends P5ToolAnnotation<'ArrowLineTool'> {

}

class ArrowLineTool extends P5BaseTool<ArrowLineToolAnnotation> {
    static toolName = 'ArrowLineTool'
    
    constructor (annotations?: ArrowLineToolAnnotation[]) {
        super('ArrowLineTool', annotations)
        this.getToolInfo = () => {
            const title = prompt('请输入') || ''
            return Promise.resolve({
                title,
                time: new Date().getTime()
            })
        }
    }

    public draw(sk: P5): void {
        for (const annotation of this.annotations || []) {
            const startPoint = annotation.transformedStartPoint()
            const endPoint = annotation.transformedEndPoint()

            if (!startPoint || !endPoint) {
                return
            }
            sk.angleMode('degrees')
            const radio = degreeBetween(startPoint, endPoint, 'DEGREES')
            const ratio = (annotation.options?.strokeWeight || 1) * 8
            const arrowPoint1 = [
                startPoint[0] + ratio * sk.cos(radio - 145) * this.manager.scale,
                startPoint[1] + ratio * sk.sin(radio - 145) * this.manager.scale
            ]
            const arrowPoint2 = [
                startPoint[0] + ratio * sk.cos(radio + 145) * this.manager.scale,
                startPoint[1] + ratio * sk.sin(radio + 145) * this.manager.scale
            ] 
            
            super.configAnnotation(sk, annotation)

            sk.line(
                startPoint[0],
                startPoint[1],
                endPoint[0],
                endPoint[1]
            )
            sk.line(
                startPoint[0],
                startPoint[1],
                arrowPoint1[0],
                arrowPoint1[1]
            )
            sk.line(
                startPoint[0],
                startPoint[1],
                arrowPoint2[0],
                arrowPoint2[1]
            )
            sk.noStroke()
            sk.textSize(annotation.options.textSize! * this.manager.scale)
            sk.fill(annotation.options.strokeColor!)
            sk.push()
            const offsetX = this.manager.hflip ? 5 * sk.cos(radio) / 4 : 5 * sk.cos(radio) / 4
            const offsetY = this.manager.vflip ?
                0 :
                5 * sk.sin(radio) / 4 + 0.8 * (radio > 0 ? sk.textAscent() : -sk.textAscent() * 0.5)
            this.resetTextTransform(sk, [
                annotation.startPoint![0]  + offsetX,
                annotation.startPoint![1] + offsetY
            ])
            sk.text(
                annotation.info.title || '',
                startPoint[0] + offsetX,
                startPoint[1] + offsetY
            )
            sk.pop()
        }
    }
}

export default ArrowLineTool