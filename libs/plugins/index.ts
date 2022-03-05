/*
 * @Date: 2022-03-01 13:16:30
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-03-05 13:53:28
 * @Description: file content
 */
import P5 from 'p5'
import P5BaseTool, { P5ToolAnnotation } from '../../libs/tools/baseTool'
import { CursorPoint } from '../../libs/utils'
import eventBus, { EMITTER_PLUGIN_ACTIVED } from '../../libs/utils/emitter'

class P5BasePlugin {
    static readonly pluginName: string

    public name: string = ''
    public tools: P5BaseTool<P5ToolAnnotation>[] = []
    public enabled: boolean = false
    public active: boolean = false
    private iconUrl: string
    public icon?: P5.Image
    public totalPluginsCount: number = 0
    public pluginIndex: number = 0

    public pluginItemWH: number = 20
    public pluginItemMargin: number = 5

    public touchStartPoint?: CursorPoint
    public touchEndPoint: CursorPoint = [0, 0]

    public editingAnnotation?: P5ToolAnnotation
    public pluginLayerOrigin?: CursorPoint

    public scale: number = 1
    public translateX: number = 0
    public translateY: number = 0

    constructor(imageUrl: string) {
        this.iconUrl = imageUrl
        eventBus.on(EMITTER_PLUGIN_ACTIVED, (t: string) => {
            if (t !== this.name) {
                this.active = false
            }
        })
    }

    public preload(sk: P5) {
        sk.loadImage(this.iconUrl, img => {
            this.icon = img
        })
    }

    /**
     * @description: p5 draw
     * @param {P5} sk
     * @return {*}
     */    
     public draw(sk: P5): void {
         if (!this.enabled) {
             return
         }
        for (const tool of this.tools) {
            for (const anno of tool.annotations) {
                if (tool.pointInAnnotation([sk.mouseX, sk.mouseY], anno)) {
                    if (!anno.startPoint) {
                        continue
                    }
                    this.pluginLayerOrigin = tool.getPluginOrigin(anno)
                    const x = this.pluginLayerOrigin[0] + (this.pluginItemWH + this.pluginItemMargin) * this.pluginIndex

                    sk.noStroke()
                    sk.fill('#ffffff')
                    sk.rect(
                        x,
                        this.pluginLayerOrigin[1],
                        this.pluginItemWH,
                        this.pluginItemWH
                    )
                    sk.image(
                        this.icon!,
                        x,
                        this.pluginLayerOrigin[1],
                        this.pluginItemWH,
                        this.pluginItemWH
                    )
                }
            }
        }
    }

    /**
     * @description: p5 touchStarted
     * @param {P5} sk
     * @return {*}
     */    
    public touchStarted(sk: P5) {
        for (const tool of this.tools) {
            for (const anno of tool.annotations) {
                const origin = tool.getPluginOrigin(anno)
                const x = origin[0] + (this.pluginItemWH + this.pluginItemMargin) * this.pluginIndex
                const y = origin[1]
                if (
                    sk.mouseX > x &&
                    sk.mouseX < x + this.pluginItemWH &&
                    sk.mouseY > y && 
                    sk.mouseY < y + this.pluginItemWH
                ) {
                    this.active = true
                    this.editingAnnotation = anno
                    const origin = tool.getPluginOrigin(anno)
                    this.touchStartPoint = [
                        sk.mouseX,
                        sk.mouseY
                    ]
                    eventBus.emit(EMITTER_PLUGIN_ACTIVED, this.name)
                    return
                }
            }
        }
    }

    /**
     * @description: p5 touchMoved
     * @param {P5} sk
     * @return {*}
     */    
    public touchMoved(sk: P5) {
        this.touchEndPoint = [sk.mouseX, sk.mouseY]
        this.handleTouchMoved(sk)
    }

    public touchEnded(sk: P5) {
        this.active = false
    }

    /**
     * @description: plugin实例类实现自身的touchMoved功能
     * @param {*}
     * @return {*}
     */    
    public handleTouchMoved(sk: P5) {

    }
}

export default P5BasePlugin
