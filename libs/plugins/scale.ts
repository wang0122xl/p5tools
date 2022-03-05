/*
 * @Date: 2022-03-01 13:27:23
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-03-05 17:28:54
 * @Description: file content
 */

import P5BasePlugin from ".";
import P5 from 'p5'

const ZoomPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAATtJREFUSEvllT1OxDAQhZ/jG3AMKLeiS0cD7VacIRklB2BzgESTgoaeZltoqNhuT7AcgQaJGzhBjmJkjEHZSahwl8gz3/y9scIfH+X8Z1m2SpLkKsbr+37ftu2TJJYBQEQpgOffHDDzZzDHgBxgA+AmMKzc9xIZhIA3rXVa1/XLMdHG7sYyeAdwAuCgtV7PhYSASmu9NcZsAZwtAfkGYOZNWZanS0GiAFvLAFJZsKQfA6Aoisuu6x6sDpqmeXSORsgawI6Zd2KAxHCqjUg8U53be/8YMO6v1OrGF+M4GAc3MOISEZFbL18UT0R2adrlOYy2GPCTGBcDRMQ4ZGKMuV0kg0CMbnf5EzyvRL4n19jwPZnVg3GK/EfKNtY/18x8L24yEfVTnlgxIM/zC6XUeQTyysx37r8YMHUffQC+w6kZYxwPvQAAAABJRU5ErkJggg=='

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
