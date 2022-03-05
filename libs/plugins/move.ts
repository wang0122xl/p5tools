/*
 * @Date: 2022-03-01 13:27:23
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-03-05 17:29:20
 * @Description: file content
 */

import P5BasePlugin from ".";
import P5 from 'p5'

const MovePng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAARVJREFUSEvFlsENwjAMRX/lbegE3JiiEzCApQ4ADFDJM3DsFJy4cYRhkCxQqga1IU0MKCKnHhw/2/8naQXjatt2papHAHci2nZdd7NsrSxBY/IeQD3GX4mosUCygEhyX5MJkgQEya/TDsbvLCQJYOY9gB2AIZGqOgiIqFZVP7KDiLi46MoBNgA2RNS7eTPzw2URkWrsrgFwEpHTV4Bw0xRgMYeLmXWQqyoFYOZZt76AFyAQNDrXDGCml7fwAAjdsuTxFGAphxfLOyJpu5wGMUjFzGcAa6toH8ZdygOs83eVfzWi4iL7mRa1aQBZPP4/HTSLO3IaxHL897Irfl0Xf3AiFp6OOfuavV3XS0IXffQDC3/82/IEL+oxZnXZjqwAAAAASUVORK5CYII='

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
