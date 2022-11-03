/*
 * @Date: 2022-02-24 15:58:06
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-11-03 10:24:20
 * @Description: 角度
 */

import P5BaseTool, { P5ToolAnnotation } from './baseTool/index'
import P5 from 'p5'
import { calculateAngle, CursorPoint } from '../utils/index'

interface AngleToolAnnotation extends P5ToolAnnotation<'AngleTool'> {
    points: [CursorPoint, CursorPoint?, CursorPoint?]
}

class AngleTool extends P5BaseTool<AngleToolAnnotation> {
    static toolName = 'AngleTool'
    public showAngle = false

    constructor(annotations?: AngleToolAnnotation[]) {
        super('AngleTool', annotations)
    }

    private angleTransformPoint (anno: AngleToolAnnotation, point?: CursorPoint): CursorPoint | undefined {
        if (!point) {
            return undefined
        }
        return [
            this.transformValue(point[0] + anno.translateX) + this.manager.translate[0],
            this.transformValue(point[1] + anno.translateY) + this.manager.translate[1],
        ]
    }

    // 覆盖父类行为
    public touchStarted(sk: P5): void {
        if (!this.editingAnnotation) {
            this.editingAnnotation = {
                ...this.getInitialAnnotation(),
                belong: 'AngleTool',
                points: [this.restorePoint([sk.mouseX, sk.mouseY])]
            }
            this.annotations.push(this.editingAnnotation)
        }
    }

    private moved(sk: P5): void {
        if (!this.editingAnnotation) {
            return
        }
        if (this.editingAnnotation.points.length < 3) {
            this.editingAnnotation.points[1] = this.restorePoint([sk.mouseX, sk.mouseY])
        } else {
            this.editingAnnotation.points[2] = this.restorePoint([sk.mouseX, sk.mouseY])
        }
    }

    public mouseMoved(sk: P5): void {
        this.moved(sk)
    }
    public touchMoved(sk: P5): void {
        this.moved(sk)
    }

    public touchEnded(sk: P5): void {
        if (!this.editingAnnotation) {
            return
        }
        if (this.editingAnnotation.points.length === 2) {
            this.editingAnnotation.points[2] = this.restorePoint([sk.mouseX, sk.mouseY])
        } else if (this.editingAnnotation.points.length === 3) {
            this.editingAnnotation = undefined
        }
    }

    public turnToDisabled(): void {
        super.turnToDisabled()
        if (this.editingAnnotation) {
            this.editingAnnotation = undefined
            this.annotations.splice(this.annotations.length - 1, 1)
        }
    }

    public draw(sk: P5): void {
        for (const anno of this.annotations) {
            const [point1, point2, point3] = anno.points
            const [transformed1, transformed2, transformed3] = [
                this.angleTransformPoint(anno, point1),
                this.angleTransformPoint(anno, point2),
                this.angleTransformPoint(anno, point3)
            ]

            super.configAnnotation(sk, anno)

            if (transformed1 && transformed2) {
                sk.line(
                    transformed1[0],
                    transformed1[1],
                    transformed2[0],
                    transformed2[1]
                )
            }

            if (transformed2 && transformed3) {
                sk.line(
                    transformed2[0],
                    transformed2[1],
                    transformed3[0],
                    transformed3[1]
                )
            }

            if (transformed1 && transformed2 && transformed3 && this.showAngle) {
                sk.textSize((anno.options.textSize || 14) * this.scale)
                sk.fill(anno.options.strokeColor!)
                const angle = calculateAngle(transformed1, transformed2, transformed3)
                const offset = (transformed1[0] > transformed2[0] ? -30 : 10) * this.scale
                if (this.showAngle) {
                    sk.text(
                        angle + '°',
                        transformed2[0] + offset,
                        transformed2[1] + (anno.options.textSize || 15) * this.scale / 3
                    )
                }
            }
        }
    }
}

export default AngleTool