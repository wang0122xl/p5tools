/*
 * @Date: 2022-02-24 15:58:06
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-11-04 13:10:02
 * @Description: file content
 */

import P5BaseTool, { P5ToolAnnotation, P5ToolBaseInfo, P5ToolGetInfo } from './baseTool'
import P5 from 'p5'
import { CursorPoint, promisifyToBlob } from '../utils'
import emitter, { EMITTER_ANNOTATION_CROPPED } from '../utils/emitter'

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

interface CropToolAnnotation extends P5ToolAnnotation<'CropTool'> {
    
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

    public images: {
        info: P5ToolBaseInfo,
        url: string
    }[] = []

    private pg?: P5

    public startRect?: CropRectFunc
    public endRect?: CropRectFunc

    public endCrop () {
        delete this.editingAnnotation?.startPoint
        this.annotations = []
    }

    public async pureCrop(sk: P5, startPoint: CursorPoint, endPoint: CursorPoint, type?: string) {
        const [startX, startY] = startPoint
        const [endX, endY] = endPoint
        sk.imageMode('corner')
        const prevImage = sk.get()
        sk.noLoop();
        (sk as any).clear()
        sk.image(prevImage, 0, 0, sk.width, sk.height)
        const cropCanvas = ((sk.get(startX + offset / 2, startY + offset / 2, endX - startX - offset, endY - startY - offset) as any).canvas) as HTMLCanvasElement

        const cropBlob = await promisifyToBlob(cropCanvas, type)
        sk.loop()
        return cropBlob
    }

    public async doCrop (sk: P5, beforeCallback?: (sk: P5) => Promise<unknown>, endCallback?: (sk: P5) => Promise<unknown>) {
        const anno = this.annotations[0]

        await beforeCallback?.(sk)
        const cropBlob = await this.pureCrop(sk, anno.transformedStartPoint()!, anno.transformedEndPoint()!)
        await endCallback?.(sk)

        if (cropBlob) {
            const url = URL.createObjectURL(cropBlob)
            const info = await this.getToolInfo(this);
            this?.images.push({
                info,
                url
            })
            emitter.emit(EMITTER_ANNOTATION_CROPPED)
        }

        this.endCrop()
    }

    constructor(annotations?: CropToolAnnotation[], images?: string[]) {
        super('CropTool', annotations)
        this.state.cropedImages = images || []
    }

    public touchStarted(sk: P5): void {
        const startPoint = this.editingAnnotation?.startPoint
        const endPoint = this.editingAnnotation?.endPoint
        const restoredPoint = this.restorePoint([sk.mouseX, sk.mouseY])
        this.cursorPosition = getPointPosition(restoredPoint, startPoint, endPoint)

        if (this.cursorPosition === 'out-rect') {
            this.editingAnnotation = {
                ...this.getInitialAnnotation(),
                belong: 'CropTool',
                startPoint: restoredPoint,
            }
            this.annotations = [this.editingAnnotation]
            this.startRect?.({
                startX: restoredPoint[0],
                startY: restoredPoint[1]
            })
        }

        this.touchStartPoint = [sk.mouseX, sk.mouseY]
    }

    public touchMoved(sk: P5): void {
        const anno = this.editingAnnotation!
        const restoredPoint = this.restorePoint([sk.mouseX, sk.mouseY])

        if (this.cursorPosition === 'out-rect') {
            anno.endPoint = restoredPoint
        }

        const startPoint = anno.startPoint
        const endPoint = anno.endPoint

        let startX: number = startPoint![0]
        let startY: number = startPoint![1]
        let endX: number = endPoint![0]
        let endY: number = endPoint![1]
        const transformX = (sk.mouseX - this.touchStartPoint[0]) / this.manager.scale
        const transformY = (sk.mouseY - this.touchStartPoint[1]) / this.manager.scale

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
        
        this.doEndRect()
    }

    private doEndRect () {
        if (!this.editingAnnotation?.startPoint || !this.editingAnnotation.endPoint) {
            return
        }
        const startPoint = this.editingAnnotation.transformedStartPoint()
        const endPoint = this.editingAnnotation.transformedEndPoint()
        this.endRect?.({
            startX: Math.min(startPoint![0], endPoint![0]),
            startY: Math.min(startPoint![1], endPoint![1]),
            endX: Math.max(startPoint![0], endPoint![0]),
            endY: Math.max(startPoint![1], endPoint![1])
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

        if (sk.width !== this.pg.width || sk.height !== this.pg.height) {
            this.pg.resizeCanvas(sk.width, sk.height);
            this.doEndRect()
        } else {
            (this.pg as any)?.clear();
        }
        this.pg.background(0, 0, 0, 120)

        if (!this.editingAnnotation) {
            return
        }
        const annotation = this.editingAnnotation!
        const startPoint = annotation.transformedStartPoint()
        const endPoint = annotation.transformedEndPoint()
        if (!startPoint || !endPoint) {
            return
        }
        const startX = Math.min(startPoint[0], endPoint[0])
        const startY = Math.min(startPoint[1], endPoint[1])
        const endX = Math.max(startPoint[0], endPoint[0])
        const endY = Math.max(startPoint[1], endPoint[1])

        const position = getPointPosition(this.restorePoint([sk.mouseX, sk.mouseY]), annotation.startPoint, annotation.endPoint)
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
            startX,
            startY,
            endX,
            startY,
            endX,
            endY,
            startX,
            endY
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