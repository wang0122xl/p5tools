/*
 * @Date: 2022-03-01 13:27:23
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-03-03 14:15:25
 * @Description: file content
 */

import P5BasePlugin from ".";
import P5 from 'p5'
import MovePng from './assets/move.png'

class MovePlugin extends P5BasePlugin {
    constructor() {
        super(MovePng)
        this.name = 'MovePlugin'
    }
    
    public handleTouchMoved(sk: P5): void {
        if (!this.editingAnnotation) {
            return
        }
        this.editingAnnotation.translateX = (this.touchEndPoint[0] - this.touchStartPoint![0]) / this.scale + this.editingAnnotation.translateX
        this.editingAnnotation.translateY = (this.touchEndPoint[1] - this.touchStartPoint![1]) / this.scale + this.editingAnnotation.translateY
        this.touchStartPoint = [sk.mouseX, sk.mouseY]
    }
}

export default MovePlugin
