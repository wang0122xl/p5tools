/*
 * @Date: 2022-02-24 15:58:06
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-11-03 09:07:53
 * @Description: 旋转
 */

import P5BaseTool from './baseTool/index'
import P5 from 'p5'
import { CursorPoint, distanceBetween } from '../utils/index'

class RotateTool extends P5BaseTool<any> {
    static toolName = 'RotateTool'

    constructor() {
        super('RotateTool')
    }

    public draw(sk: P5): void {
        
    }
}

export default RotateTool