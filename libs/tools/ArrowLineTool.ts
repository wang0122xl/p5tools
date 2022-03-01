/*
 * @Date: 2022-02-24 15:58:06
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-03-01 13:11:42
 * @Description: file content
 */

import P5BaseTool, { P5BaseAnnotation, P5ToolOptions } from './baseTool'
import P5 from 'p5'
import { degreeBetween } from '../utils'

interface ArrowLineToolAnnotation extends P5BaseAnnotation<'ArrowLineTool'> {
    text: string
}

class ArrowLineTool extends P5BaseTool<ArrowLineToolAnnotation> {
    static toolName = 'ArrowLineTool'
    
    constructor (annotations?: ArrowLineToolAnnotation[]) {
        super('ArrowLineTool', annotations)
    }

    public touchEnded(sk: P5): void {
        super.touchEnded(sk)
        this.getText().then(t => {
            this.editingAnnotation!.text = t
        })
    }
    
    // public getInitialOptions(): ToolOptions {
    //     return {
    //         ...super.getInitialOptions(),
    //         fillColor: '#333'
    //     }
    // }

    public draw(sk: P5): void {
        for (const annotation of this.annotations || []) {
            const startPoint = annotation.startPoint
            const endPoint = annotation.endPoint

            if (!startPoint || !endPoint) {
                return
            }
            sk.angleMode('degrees')
            const radio = degreeBetween(startPoint, endPoint, 'DEGREES')
            const ratio = (annotation.options?.strokeWeight || 1) * 8
            const arrowPoint1 = [
                startPoint[0] + ratio * sk.cos(radio - 145),
                startPoint[1] + ratio * sk.sin(radio - 145)
            ]
            const arrowPoint2 = [
                startPoint[0] + ratio * sk.cos(radio + 145),
                startPoint[1] + ratio * sk.sin(radio + 145)
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
            sk.textSize(annotation.options.textSize!)
            sk.fill(annotation.options.strokeColor!)
            sk.text(
                annotation.text,
                startPoint[0] + 5 * sk.cos(radio) / 4,
                startPoint[1] + 5 * sk.sin(radio) / 4 + 0.8 * (radio > 0 ? sk.textAscent() : -sk.textAscent() * 0.5)
            )

            
        }
    }
}

export default ArrowLineTool