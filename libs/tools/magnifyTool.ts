/*
 * @Date: 2022-02-24 15:58:06
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-11-03 17:59:20
 * @Description: 放大镜🔍
 */

import P5BaseTool from './baseTool/index'
import P5 from 'p5'

class MagnifyTool extends P5BaseTool<any> {
    static toolName = 'MagnifyTool'

    public areaWidth = 50 // 需要放大的区域边长
    public zoomScale = 2 // 放大倍数

    constructor() {
        super('MagnifyTool')
    }

    public draw(sk: P5): void {
        if (this.editingAnnotation && this.loadedImage) {
            const point = this.editingAnnotation.endPoint || this.editingAnnotation.startPoint
            const transformedPoint = this.editingAnnotation.transformedEndPoint() || this.editingAnnotation.transformedStartPoint()
            const radio = this.areaWidth / 2
            const finalScale = this.manager.scale * this.zoomScale
            
            const areaImg = this.loadedImage.get(point[0] - radio + this.loadedImage.width / 2, point[1] - radio + this.loadedImage.height / 2, this.areaWidth, this.areaWidth)
            
            sk.image(
                areaImg,
                transformedPoint[0],
                transformedPoint[1],
                this.areaWidth * finalScale,
                this.areaWidth * finalScale
            )
        }
    }
}

export default MagnifyTool