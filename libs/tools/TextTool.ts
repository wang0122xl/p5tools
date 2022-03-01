/*
 * @Date: 2022-02-24 15:58:06
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-03-01 13:13:52
 * @Description: file content
 */

import P5BaseTool, { P5BaseAnnotation } from './baseTool'
import P5 from 'p5'

interface TextToolAnnotation extends P5BaseAnnotation<'TextTool'> {
    text: string
}

class TextTool extends P5BaseTool<TextToolAnnotation> {
    static toolName = 'TextTool'
    private inputing: boolean = false
    
    constructor (annotations?: TextToolAnnotation[]) {
        super('TextTool', annotations)
    }

    public touchStarted(sk: P5): void {
        if (this.inputing) {
            return
        }
        this.editingAnnotation = {
            ...this.getInitialAnnotation(),
            belong: 'TextTool',
            text: '',
        }
        this.annotations.push(this.editingAnnotation)
    }

    public touchEnded(sk: P5): void {
        if (this.inputing) {
            return
        }
        this.editingAnnotation!.endPoint = [sk.mouseX, sk.mouseY]
        this.inputing = true
        this.getText().then(t => {
            this.inputing = false
            this.editingAnnotation!.text = t
        }).catch(e => this.inputing = false)
    }

    public draw(sk: P5): void {
        for (const annotation of this.annotations || []) {
            const endPoint = annotation.endPoint

            if (!endPoint) {
                return
            }

            super.configAnnotation(sk, annotation)
            sk.noStroke()
            
            const text = annotation.text || ''
            const textWidth = sk.textWidth(text)
            sk.text(
                text,
                endPoint[0] - textWidth / 2,
                endPoint[1]
            )
        }
    }
}

export default TextTool