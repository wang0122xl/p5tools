/*
 * @Date: 2022-02-24 15:58:06
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-11-03 11:00:18
 * @Description: 旋转
 */

import P5BaseTool from './baseTool/index'
import P5 from 'p5'

class MoveTool extends P5BaseTool<any> {
    static toolName = 'MoveTool'

    constructor() {
        super('MoveTool')
    }

    public touchMoved(sk: P5): void {
        if (this.manager) {
            const [originX, originY] = this.manager.translate
            this.manager.translate = [
                originX + sk.mouseX - sk.pmouseX,
                originY + sk.mouseY - sk.pmouseY
            ]
        }
    }
    
}

export default MoveTool