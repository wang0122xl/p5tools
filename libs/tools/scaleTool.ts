/*
 * @Date: 2022-02-24 15:58:06
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-11-03 11:26:55
 * @Description: 旋转
 */

import P5BaseTool from './baseTool/index'
import P5 from 'p5'

class ScaleTool extends P5BaseTool<any> {
    static toolName = 'ScaleTool'

    public minScale = 0.1
    public maxScale = 5

    constructor() {
        super('ScaleTool')
    }

    public touchMoved(sk: P5): void {
        const offset = sk.mouseY - sk.pmouseY
        // 小于最低缩放，且将继续缩小
        if (this.manager.scale < this.minScale && offset > 0) {
            return
        }
        // 大于最大缩放，且将继续放大
        if (this.manager.scale > this.maxScale && offset < 0) {
            return
        }
        this.manager.scale -= offset / 200
    }
    
}

export default ScaleTool