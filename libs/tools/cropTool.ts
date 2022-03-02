/*
 * @Date: 2022-02-24 15:58:06
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-03-02 22:38:36
 * @Description: file content
 */

import P5BaseTool, { P5BaseAnnotation } from './baseTool'
import P5 from 'p5'
import { CursorPoint } from '../utils'

type CursorPosition = 'top' | 'top-right' | 'top-left' | 'left' | 'right' | 'bottom' | 'bottom-left' | 'bottom-right' | 'in-rect' | 'out-rect'

const CursorStyleMapping: Record<CursorPosition, string> = {
    'top': 'ns-resize',
    'top-right': 'nesw-resize',
    'top-left': 'nwse-resize',
    'left': 'ew-resize',
    'right': 'ew-resize',
    'in-rect': 'MOVE',
    'out-rect': 'default',
    'bottom': 'ns-resize',
    'bottom-left': 'nesw-resize',
    'bottom-right': 'nwse-resize'
}

const offset = 6 // 误差
interface CropToolAnnotation extends P5BaseAnnotation<'CropTool'> {

}

const getPointPosition = (point: CursorPoint, start?: CursorPoint, end?: CursorPoint): CursorPosition => {
    let position: CursorPosition = 'out-rect'
    if (!start || !end) {
        return 'out-rect'
    }

    const [pointX, pointY] = point
    const startX = Math.min(start[0], end[0])
    const endX = Math.max(start[0], end[0])
    const startY = Math.min(start[1], end[1])
    const endY = Math.max(start[1], end[1])

    const inLeftLine = pointX > startX - offset && pointX < startX + offset
    const inTopLine = pointY > startY - offset && pointY < startY + offset
    const inRightLine = pointX > endX - offset && pointX < endX + offset
    const inBottomLine = pointY > endY - offset && pointY < endY + offset

    if (pointX > startX + offset && pointX < endX - offset && pointY > startY + offset && pointY < endY - offset) {
        position = 'in-rect'
    } else if (inTopLine) {
        position = 'top'
        if (inLeftLine) {
            position = 'top-left'
        } else if (inRightLine) {
            position = 'top-right'
        }
    } else if (inBottomLine) {
        position = 'bottom'
        if (inLeftLine) {
            position = 'bottom-left'
        } else if (inRightLine) {
            position = 'bottom-right'
        }
    } else if (inLeftLine) {
        position = 'left'
    } else if (inRightLine) {
        position = 'right'
    } else {
        position = 'out-rect'
    }

    return position

}

type CropRectFunc = (p: {
    startX: number
    startY: number
    endX?: number
    endY?: number
}) => void

class CropTool extends P5BaseTool<CropToolAnnotation, {
    cropedImages: string[]
}> {
    static toolName = 'CropTool'
    private cursorPosition: CursorPosition = 'out-rect'

    private touchStartPoint: CursorPoint = [0, 0]

    private pg?: P5

    public startRect?: CropRectFunc
    public endRect?: CropRectFunc

    public endCrop () {
        delete this.editingAnnotation?.startPoint
        this.annotations = []
    }

    public async doCrop (sk: P5, beforeCallback?: () => Promise<any>, endCallback?: () => Promise<any>) {     
        const anno = this.annotations[0]
        const [startX, startY] = anno.startPoint!
        const [endX, endY] = anno.endPoint!

        const cropCanvas = ((sk.get(startX + offset / 2, startY + offset / 2, endX - startX - offset, endY - startY - offset) as any).canvas) as HTMLCanvasElement
        cropCanvas.toBlob(blob => {
            if (blob) {
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = '1.png'
                a.click()
            }
        })

        this.endCrop()
    }

    constructor(annotations?: CropToolAnnotation[], images?: string[]) {
        super('CropTool', annotations)
        this.state.cropedImages = images || []
    }

    public touchStarted(sk: P5, event: any): void {
        if (event.target.nodeName !== 'CANVAS') {
            return
        }
        this.cursorPosition = getPointPosition([sk.mouseX, sk.mouseY], this.editingAnnotation?.startPoint, this.editingAnnotation?.endPoint)
        if (this.cursorPosition === 'out-rect') {
            this.editingAnnotation = {
                ...this.getInitialAnnotation(),
                belong: 'CropTool',
                startPoint: [sk.mouseX, sk.mouseY]
            }
            this.annotations = [this.editingAnnotation]
            this.startRect?.({
                startX: sk.mouseX,
                startY: sk.mouseY
            })
        }

        this.touchStartPoint = [sk.mouseX, sk.mouseY]
    }

    public touchMoved(sk: P5): void {
        const anno = this.editingAnnotation!

        if (this.cursorPosition === 'out-rect') {
            anno.endPoint = [sk.mouseX, sk.mouseY]
            this.editingAnnotation!.endPoint = [sk.mouseX, sk.mouseY]
        }
        let startX: number = anno.startPoint![0]
        let startY: number = anno.startPoint![1]
        let endX: number = anno.endPoint![0]
        let endY: number = anno.endPoint![1]
        const transformX = sk.mouseX - this.touchStartPoint[0]
        const transformY = sk.mouseY - this.touchStartPoint[1]

        switch (this.cursorPosition) {
            case 'in-rect':
                startX += transformX
                startY += transformY
                endX += transformX
                endY += transformY
                break;
            case 'top':
                startY += transformY
                break
            case 'bottom':
                endY += transformY
                break
            case 'left':
                startX += transformX
                break
            case 'right':
                endX += transformX
                break
            case 'top-left':
                startX += transformX
                startY += transformY
                break
            case 'top-right':
                endX += transformX
                startY += transformY
                break
            case 'bottom-left':
                startX += transformX
                endY += transformY
                break
            case 'bottom-right':
                endX += transformX
                endY += transformY
                break
            default:
                break;
        }

        anno.startPoint = [startX, startY]
        anno.endPoint = [endX, endY]

        this.touchStartPoint = [sk.mouseX, sk.mouseY]

        this.endRect?.({
            startX: Math.min(this.editingAnnotation!.startPoint![0], this.editingAnnotation!.endPoint![0]),
            startY: Math.min(this.editingAnnotation!.startPoint![1], this.editingAnnotation!.endPoint![1]),
            endX: Math.max(this.editingAnnotation!.startPoint![0], this.editingAnnotation!.endPoint![0]),
            endY: Math.max(this.editingAnnotation!.startPoint![1], this.editingAnnotation!.endPoint![1])
        })
    }

    public touchEnded(sk: P5): void {
        if (this.editingAnnotation) {
            this.reverseStartEndPointByOrder()
        }
    }

    private drawCropArea(startX: number, startY: number, endX: number, endY: number) {
        if (!this.pg) {
            return
        }
        const annotation = this.editingAnnotation!

        this.pg.erase()
        this.pg.quad(
            startX + annotation.translateX + 1,
            startY + annotation.translateY + 1,
            endX + annotation.translateX - 1,
            startY + annotation.translateY + 1,
            endX + annotation.translateX - 1,
            endY + annotation.translateY - 1,
            startX + annotation.translateX + 1,
            endY + annotation.translateY - 1
        )
        this.pg.noErase()
    }

    public draw(sk: P5): void {
        if (!this.pg) {
            this.pg = sk.createGraphics(sk.width, sk.height)
        }
        (this.pg as any)?.clear()
        this.pg.background(0, 0, 0, 120)

        if (!this.editingAnnotation) {
            return
        }
        const annotation = this.editingAnnotation!
        const startPoint = annotation.startPoint
        const endPoint = annotation.endPoint
        if (!startPoint || !endPoint) {
            return
        }
        const startX = Math.min(startPoint[0], endPoint[0])
        const startY = Math.min(startPoint[1], endPoint[1])
        const endX = Math.max(startPoint[0], endPoint[0])
        const endY = Math.max(startPoint[1], endPoint[1])

        const position = getPointPosition([sk.mouseX, sk.mouseY], startPoint, endPoint)
        if (position === 'out-rect') {
            sk.cursor(sk.CROSS)
        } else {
            sk.cursor(CursorStyleMapping[position])
        }

        this.pg.stroke(annotation.options.strokeColor!)
        this.pg?.stroke(annotation.options.strokeColor!)
        this.pg?.strokeWeight(1)
        this.pg.fill(255, 255, 255, 255)
        this.pg?.quad(
            startX + annotation.translateX,
            startY + annotation.translateY,
            endX + annotation.translateX,
            startY + annotation.translateY,
            endX + annotation.translateX,
            endY + annotation.translateY,
            startX + annotation.translateX,
            endY + annotation.translateY
        )
        this.drawCropArea(startX, startY, endX, endY)

        const points = [
            [startX, startY],
            [startX, endY],
            [endX, startY],
            [endX, endY]
        ]
        this.pg?.fill(annotation.options.strokeColor!)
        points.forEach(([x, y]) => {
            this.pg?.quad(
                x - offset / 2,
                y - offset / 2,
                x + offset / 2,
                y - offset / 2,
                x + offset / 2,
                y + offset / 2,
                x - offset / 2,
                y + offset / 2
            )
        })

        sk.image(this.pg as any, 0, 0, sk.width, sk.height)
    }
}

export default CropTool