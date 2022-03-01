/*
 * @Date: 2022-02-24 17:10:02
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-03-01 11:55:13
 * @Description: file content
 */

import P5 from 'p5'
import BaseTool, { P5BaseAnnotation } from './baseTool/BaseTool'
import CircleTool from './CircleTool'
import SquareTool from './SquareTool'
import LineTool from './LineTool'
import ArrowLineTool from './ArrowLineTool'

import FreehandTool from './FreehandTool'
import TextTool from './TextTool'
import type { P5ToolOptions } from './baseTool/BaseTool'

type SKTouchStatus = 'start' | 'moving' | 'end'

class P5ToolsManager {
    private tools: BaseTool<any>[] = []
    /** mapping结构的tools，方便取值 */ 
    private _toolsMapping: Record<string, BaseTool<any>> = {}

    public annotations: P5BaseAnnotation[] = []
    public touchStatus: SKTouchStatus = 'end'
    public hasEnabledToolCallback?: (has: boolean) => void
    
    /** 当前正在使用的工具 */
    private _enabledTool?: BaseTool<any>

    static CircleTool = CircleTool
    static SquareTool = SquareTool
    static LineTool = LineTool
    static FreehandTool = FreehandTool
    static TextTool = TextTool
    static ArrowLineTool = ArrowLineTool

    constructor (tools: BaseTool<any>[], annotations?: P5BaseAnnotation[]) {
        this.tools = tools
        
        this._toolsMapping = tools.reduce((p, c) => {
            p[c.name] = c
            return p
        }, {} as Record<string, BaseTool<any>>)
        
        if (annotations) {
            this.annotations = annotations
        }

        this.initTools(tools, annotations)
    }

    set enabledTool (tool: BaseTool<any> | undefined) {
        this._enabledTool = tool
        this.hasEnabledToolCallback?.(!!tool)
    }
    get enabledTool () {
        return this._enabledTool
    }

    /**
     * @description: 初始化所有工具的标注信息
     * @param {BaseTool} tools
     * @param {BaseAnnotation} annotations
     * @return {*}
     */    
    private initTools(tools: BaseTool<any>[], annotations?: P5BaseAnnotation[]) {
        const annotationsMapping: {
            [name: string]: P5BaseAnnotation[]
        } = {}
        // 两次循环将所有标注指定给对应的工具类里
        for (const anno of annotations || []) {
            if (!(anno.belong in annotationsMapping)) {
                annotationsMapping[anno.belong] = []
            }
            annotationsMapping[anno.belong].push(anno)
        }

        for (const tool of tools) {
            tool.annotations = annotationsMapping[tool.name] || []
        }
    }

    /**
     * @description: p5 setup
     * @param {P5} sk
     * @return {*}
     */    
    public setup(sk: P5) {
        for (const tool of this.tools) {
            tool.setup(sk)
        }
    }

    /**
     * @description: p5 preload
     * @param {P5} sk
     * @return {*}
     */    
    public preload(sk: P5) {
        for (const tool of this.tools) {
            tool.preload(sk)
        }
    }

    /**
     * @description: p5 draw
     * @param {P5} sk
     * @return {*}
     */    
    public draw(sk: P5) {
        for (const tool of this.tools) {
            tool.draw(sk)
        }
    }

    /**
     * @description: p5 touchStart
     * @param {P5} sk
     * @return {*}
     */    
    public touchStarted(sk: P5) {
        this.touchStatus = 'start'
        this.enabledTool?.touchStarted(sk)
    }

    /**
     * @description: p5 touchMoved
     * @param {P5} sk
     * @return {*}
     */    
    public touchMoved(sk: P5) {
        this.touchStatus = 'moving'
        this.enabledTool?.touchMoved(sk)
    }

    /**
     * @description: p5 touchEnd
     * @param {P5} sk
     * @return {*}
     */    
    public touchEnded(sk: P5) {
        this.touchStatus = 'end'
        this.enabledTool?.touchEnded(sk)
    }

    /**
     * @description: 根据名字获取对应工具
     * @param {string} name
     * @return {*}
     */    
    private findTool(name: string) {
        return this._toolsMapping[name]
    }

    /**
     * @description: 根据名字设置工具为可用状态
     * @param {string} name
     * @param {any} initialState
     * @return {*}
     */     
    public setToolEnabled(name: string, options?: P5ToolOptions) {
        const tool = this.findTool(name)
        if (!tool) {
            console.error('未设置tool：%s', name)
        } else {
            tool.options = options
            this.enabledTool = tool
        }
    }

    /**
     * @description: 退出工具的使用
     * @param {*}
     * @return {*}
     */    
    public quitTool() {
        this.enabledTool = undefined
    }
    
}

export default P5ToolsManager
