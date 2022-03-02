/*
 * @Date: 2022-02-28 18:40:59
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-03-02 18:24:30
 * @Description: file content
 */
import { MouseEvent } from 'react'
import chooseOptions from './choose-options'
import './pannel.less'
import P5ToolsManager from '../../libs/manager'
import P5 from 'p5'

const Pannel = (props: {
    manager: P5ToolsManager
    sk?: P5
}) => {
    const selectTool = async (e: MouseEvent, toolName: string) => {
        const option = await chooseOptions(e)
        props.sk?.cursor(props.sk.ARROW)

        if (toolName === P5ToolsManager.TextTool.toolName) {
            props.manager.setToolEnabled(toolName, {
                fillColor: option.color,
                strokeAlpha: option.alpha,
                textSize: option.width
            })
        } else {
            props.manager.setToolEnabled(toolName, {
                strokeColor: option.color,
                strokeAlpha: option.alpha,
                strokeWeight: option.width
            })
        }
        
    }

    const doCrop = () => {
        props.sk?.cursor(props.sk.CROSS)

        props.manager.setToolEnabled(P5ToolsManager.CropTool.name, {
            strokeColor: 'blue'
        })
    }
    return (
        <div className="pannel z-1">
            <p onClick={e => selectTool(e, P5ToolsManager.CircleTool.toolName)}>圆形</p>
            <p onClick={e => selectTool(e, P5ToolsManager.SquareTool.toolName)}>方形</p>
            <p onClick={e => selectTool(e, P5ToolsManager.TextTool.toolName)}>文字</p>
            <p onClick={e => selectTool(e, P5ToolsManager.LineTool.toolName)}>直线</p>
            <p onClick={e => selectTool(e, P5ToolsManager.ArrowLineTool.toolName)}>箭头</p>

            <p onClick={e => selectTool(e, P5ToolsManager.FreehandTool.toolName)}>freehand</p>
            <p onClick={e => doCrop()}>裁剪</p>
        </div>
    )
}

export default Pannel
