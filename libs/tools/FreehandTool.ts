/*
 * @Date: 2022-02-24 15:58:06
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-03-01 11:56:12
 * @Description: file content
 */

import P5BaseTool, { P5BaseAnnotation } from './baseTool/BaseTool'
import P5 from 'p5'
import { distanceBetween } from '../utils/index'
import type { CursorPoint } from '../utils/index'
import _ from 'lodash'

interface FreehandToolAnnotation extends P5BaseAnnotation<'FreehandTool'> {
    freePaths: CursorPoint[]
}

class FreehandTool extends P5BaseTool<FreehandToolAnnotation> {
    static toolName = 'FreehandTool'
    
    constructor (annotations?: FreehandToolAnnotation[]) {
        super('FreehandTool', annotations)
    }

    public getInitialAnnotation(): FreehandToolAnnotation {
        return {
            ...super.getInitialAnnotation(),
            belong: 'FreehandTool',
            freePaths: []
        }
    }

    public touchMoved(sk: P5): void {
        const prevPoint = _.last(this.editingAnnotation?.freePaths) || this.editingAnnotation?.startPoint
        const point = [sk.mouseX, sk.mouseY] as CursorPoint

        if (prevPoint && point && distanceBetween(prevPoint, point) > 4) {
            this.editingAnnotation?.freePaths.push(point)
        }
    }

    public draw(sk: P5): void {
        for (const annotation of this.annotations || []) {
            const startPoint = annotation.startPoint!
            const endPoint = annotation.endPoint!
            const allPaths = [startPoint, ...annotation.freePaths, endPoint]
            
            super.configAnnotation(sk, annotation)
            
            for (let i = 0; i < allPaths.length - 1; i++) {
                const start = allPaths[i]
                const end = allPaths[i + 1]

                if (!end) {
                    break
                }
                
                sk.line(
                    start[0],
                    start[1],
                    end[0],
                    end[1]
                )
            }
        }
    }
}

export default FreehandTool