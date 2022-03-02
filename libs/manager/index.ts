/*
 * @Date: 2022-02-24 17:10:02
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-03-02 22:12:44
 * @Description: file content
 */

import P5 from 'p5'
import P5BaseTool, { P5BaseAnnotation } from '../tools/baseTool'
import CircleTool from '../tools/circleTool'
import SquareTool from '../tools/squareTool'
import LineTool from '../tools/lineTool'
import ArrowLineTool from '../tools/arrowLineTool'
import FreehandTool from '../tools/freehandTool'
import TextTool from '../tools/textTool'
import CropTool from '../tools/cropTool'

import P5BasePlugin from '../plugins'
import MovePlugin from '../plugins/move'
import ScalePlugin from '../plugins/scale'


import type { P5ToolOptions } from '../tools/baseTool'
import _ from 'lodash'

type SKTouchStatus = 'start' | 'moving' | 'end'

class P5ToolsManager {
    private tools: P5BaseTool<any>[] = []
    private plugins: P5BasePlugin[] = []
    /** mapping结构的tools，方便取值 */ 
    private _toolsMapping: Record<string, P5BaseTool<any>> = {}

    public annotations: P5BaseAnnotation[] = []
    public touchStatus: SKTouchStatus = 'end'
    public hasEnabledToolCallback?: (has: boolean) => void
    
    /** 当前正在使用的工具 */
    private _enabledTool?: P5BaseTool<any>

    static CircleTool = CircleTool
    static SquareTool = SquareTool
    static LineTool = LineTool
    static FreehandTool = FreehandTool
    static TextTool = TextTool
    static ArrowLineTool = ArrowLineTool
    static CropTool = CropTool

    static MovePlugin = MovePlugin
    static ScalePlugin = ScalePlugin

    constructor (tools: P5BaseTool<any>[], annotations?: P5BaseAnnotation[]) {
        this.tools = tools
        
        this._toolsMapping = tools.reduce((p, c) => {
            p[c.name] = c
            return p
        }, {} as Record<string, P5BaseTool<any>>)
        
        if (annotations) {
            this.annotations = annotations
        }

        this.initTools(tools, annotations)
    }

    set enabledTool (tool: P5BaseTool<any> | undefined) {
        this._enabledTool = tool
        this.hasEnabledToolCallback?.(!!tool)
        for (const plugin of this.plugins) {
            plugin.enabled = !tool
        }
    }
    get enabledTool () {
        return this._enabledTool
    }

    /**
     * @description: 初始化所有工具的标注信息
     * @param {P5BaseTool} tools
     * @param {BaseAnnotation} annotations
     * @return {*}
     */    
    private initTools(tools: P5BaseTool<any>[], annotations?: P5BaseAnnotation[]) {
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
        for (const plugin of this.plugins) {
            plugin.preload(sk)
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
        for (const plugin of this.plugins) {
            plugin.draw(sk)
        }
    }

    /**
     * @description: p5 mouseMoved
     * @param {P5} sk
     * @return {*}
     */    
    public mouseMoved(sk: P5) {
        
    }

    /**
     * @description: p5 touchStart
     * @param {P5} sk
     * @param {any} event
     * @return {*}
     */    
    public touchStarted(sk: P5, event: any) {
        this.touchStatus = 'start'
        this.enabledTool?.touchStarted(sk, event)
        for (const plugin of this.plugins) {
            plugin.touchStarted(sk)
        }
    }

    /**
     * @description: p5 touchMoved
     * @param {P5} sk
     * @return {*}
     */    
    public touchMoved(sk: P5) {
        this.touchStatus = 'moving'
        this.enabledTool?.touchMoved(sk)
        for (const plugin of this.plugins) {
            plugin.touchMoved(sk)
        }
    }

    /**
     * @description: p5 touchEnd
     * @param {P5} sk
     * @return {*}
     */    
    public touchEnded(sk: P5) {
        this.touchStatus = 'end'
        this.enabledTool?.touchEnded(sk)
        for (const plugin of this.plugins) {
            plugin.touchEnded(sk)
        }
    }

    /**
     * @description: 根据名字获取对应工具
     * @param {string} name
     * @return {*}
     */    
    public findTool(name: string) {
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

    /**
     * @description: 添加plugin
     * @param {P5BasePlugin} plugin
     * @param {P5BaseTool} controlTools
     * @return {*}
     */    
    public usePlugin(plugin: P5BasePlugin, controlTools: P5BaseTool<any>[]) {
        const plug = _.find(this.plugins, ['name', plugin.name])
        if (plug) {
            console.error('%s已存在, 请勿重复添加', plugin.name)
        } else {
            plugin.tools = controlTools
            this.plugins.push(plugin)
        }
        for (let i = 0; i < this.plugins.length; i ++) {
            const plugin = this.plugins[i]
            plugin.totalPluginsCount = this.plugins.length
            plugin.pluginIndex = i
        }
        for (const tool of this.tools) {
            tool.pluginsCount = this.plugins.length
        }
        
        return this
    }
    
}

export default P5ToolsManager
