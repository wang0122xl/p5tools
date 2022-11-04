/*
 * @Date: 2022-02-24 15:58:06
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-11-03 17:26:54
 * @Description: 旋转
 */

import P5BaseTool from './baseTool/index'
import P5 from 'p5'
import { calculateAngle, CursorPoint, distanceBetween } from '../utils/index'

class RotateTool extends P5BaseTool<any> {
    static toolName = 'RotateTool'

    constructor() {
        super('RotateTool')
    }
    
    public touchMoved(sk: P5): void {
        const center: CursorPoint = [sk.width / 2, sk.height / 2]
        const angle = calculateAngle(
            [sk.pmouseX, sk.pmouseY],
            center,
            [sk.mouseX, sk.mouseY]
        )
        const xOffset = sk.mouseX - sk.pmouseX
        const yOffset = sk.mouseY - sk.pmouseY
        if (Math.abs(xOffset) > Math.abs(yOffset)) {
            if ((xOffset > 0 && sk.pmouseY < center[1]) || (xOffset < 0 && sk.pmouseY > center[1])) {
                this.manager.rotation += angle
            } else {
                this.manager.rotation -= angle
            }
        } else {
            if ((yOffset > 0 && sk.pmouseX > center[0]) || (yOffset < 0 && sk.pmouseX < center[0])) {
                this.manager.rotation += angle
            } else {
                this.manager.rotation -= angle
            }
        }

        
    }
}

export default RotateTool