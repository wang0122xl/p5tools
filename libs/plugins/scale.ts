/*
 * @Date: 2022-03-01 13:27:23
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-03-03 14:33:32
 * @Description: file content
 */

import P5BasePlugin from ".";
import P5 from 'p5'
import ZoomPng from './assets/zoom.png'

class ScalePlugin extends P5BasePlugin {
    constructor() {
        super(ZoomPng)
        this.name = 'ScalePlugin'
    }
    
    public handleTouchMoved(sk: P5): void {
        if (!this.editingAnnotation) {
            return
        }
        const [endX, endY] = this.editingAnnotation.endPoint!
        const [startX, startY] = this.editingAnnotation.startPoint!
        const newX = endX + (this.touchEndPoint[0] - this.touchStartPoint![0]) / this.scale
        let newY = endY + (this.touchEndPoint[1] - this.touchStartPoint![1]) / this.scale

        if (this.editingAnnotation.belong === 'CircleTool') {
            newY = startY
        }

        this.editingAnnotation.startPoint = [
            Math.min(startX, newX),
            Math.min(startY, newY)
        ]
        this.editingAnnotation.endPoint = [
            Math.max(startX, newX),
            Math.max(startY, newY)
        ]
        
        this.touchStartPoint = [sk.mouseX, sk.mouseY]

    }
}

export default ScalePlugin
