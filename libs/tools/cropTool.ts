/*
 * @Date: 2022-02-24 15:58:06
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-11-09 17:21:47
 * @Description: file content
 */

import P5BaseTool, { P5ToolAnnotation, P5ToolBaseInfo, P5ToolGetInfo } from './baseTool'
import P5 from 'p5'
import { CursorPoint, promisifyToBlob } from '../utils'

interface CropToolAnnotation extends P5ToolAnnotation<'CropTool'> {

}

class CropTool extends P5BaseTool<CropToolAnnotation, {
    cropedImages: string[]
}> {
    static toolName = 'CropTool'

    public handleCroppedImage?: (blob: Blob | null) => Promise<void>

    constructor(annotations?: CropToolAnnotation[]) {
        super('CropTool', annotations)
    }

    private sortPoints(startPoint: CursorPoint, endPoint: CursorPoint) {
        const startX = Math.min(startPoint[0], endPoint[0])
        const startY = Math.min(startPoint[1], endPoint[1])
        const endX = Math.max(startPoint[0], endPoint[0])
        const endY = Math.max(startPoint[1], endPoint[1])

        return {
            startX,
            startY,
            endX,
            endY
        }
    }

    public async pureCrop(sk: P5, startPoint: CursorPoint, endPoint: CursorPoint, type?: string) {
        const {
            startX,
            startY,
            endX,
            endY
        } = this.sortPoints(startPoint, endPoint)
        sk.imageMode('corner')
        return new Promise<Blob | null>(resolve => {
            requestAnimationFrame(() => {
                const cropCanvas = ((sk.get(startX, startY, endX - startX, endY - startY) as any).canvas) as HTMLCanvasElement

                promisifyToBlob(cropCanvas, type).then(b => resolve(b))
            })
        })

    }

    public async touchEnded(sk: P5): Promise<void> {
        if (!this.editingAnnotation) {
            return
        }
        const startPoint = this.editingAnnotation.transformedStartPoint()!
        const endPoint = this.editingAnnotation.transformedEndPoint()!
        super.touchEnded(sk)
        const blob = await this.pureCrop(sk, startPoint, endPoint)
        await this.handleCroppedImage?.(blob)
    }

    public draw(sk: P5): void {
        if (!this.editingAnnotation) {
            return
        }

        const startPoint = this.editingAnnotation.transformedStartPoint()
        const endPoint = this.editingAnnotation.transformedEndPoint()
        if (!startPoint || !endPoint) {
            return
        }

        super.configAnnotation(sk, this.editingAnnotation)
        sk.strokeWeight(1)

        sk.fill(255, 255, 255, 90)
        sk.drawingContext.setLineDash([10, 8])
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

export default CropTool