/*
 * @Date: 2022-02-28 15:12:47
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-03-01 09:41:50
 * @Description: file content
 */
import { useEffect, useMemo, useRef, useState, WheelEvent } from 'react'
import './app.less'
import P5 from 'p5'
import P5ToolsManager from '../libs/tools/Manager'
import Pannel from './components/pannel'

function App() {
    const p5ref = useRef<HTMLDivElement>(null!)
    const [sk, setSk] = useState<P5>()

    const [toolsManager] = useState<P5ToolsManager>(() => {
        const toolsManager = new P5ToolsManager([
            new P5ToolsManager.TextTool(),
            new P5ToolsManager.CircleTool(),
            new P5ToolsManager.SquareTool(),
            new P5ToolsManager.LineTool(),
            new P5ToolsManager.FreehandTool(),
            new P5ToolsManager.ArrowLineTool()
        ])
        return toolsManager
    })

    useEffect(() => {
        if (p5ref.current) {
            new P5((sk: P5) => {
                setSk(sk)
                sk.setup = () => {
                    const viewerSize = {
                        x: p5ref.current.clientWidth,
                        y: p5ref.current.clientHeight
                    }
                    sk.createCanvas(viewerSize.x, viewerSize.y)
                    toolsManager.setup(sk)
                }
                sk.draw = () => {
                    (sk as any).clear()
                    toolsManager.draw(sk)
                }
                sk.touchStarted = () => {
                    toolsManager.touchStarted(sk)
                }
                sk.touchMoved = () => {
                    toolsManager.touchMoved(sk)
                }
                sk.touchEnded = () => {
                    toolsManager.touchEnded(sk)
                    toolsManager.quitTool()
                }
            }, p5ref.current)
        }
    }, [])

    return (
        <div className='relative flex items-center justify-center w-screen h-screen overflow-hidden'>
            <img className='max-w-100vw max-h-100vh' src='https://picsum.photos/1200/600' />
            <div ref={p5ref} className='absolute left-0 right-0 top-0 bottom-0' />
            <Pannel manager={toolsManager} />
        </div>
    )
}

export default App
