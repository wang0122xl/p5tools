/*
 * @Date: 2022-02-28 15:12:47
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-03-08 10:36:52
 * @Description: file content
 */
import { useCallback, useEffect, useMemo, useRef, useState, WheelEvent } from 'react'
import './app.less'
import P5 from 'p5'
import P5ToolsManager from '../libs/manager'
import Pannel from './components/pannel'
import { CursorPoint } from '../libs/utils'
import CropTool from 'libs/tools/cropTool'
import { createPortal, render, unmountComponentAtNode } from 'react-dom'
import P5BaseTool, { P5ToolGetInfo } from '../libs/tools/baseTool'
import moment from 'moment'
import editInfo from './components/edit-info'
import _ from 'lodash'

function App() {
    const p5ref = useRef<HTMLDivElement>(null!)
    const [image, setImage] = useState<P5.Image>()
    const [sk, setSk] = useState<P5>()
    const [wrapper, setWrapper] = useState<P5.Element>()
    const [scale, setScale] = useState(1)
    const [dragging, setDragging] = useState(false)
    const [translate, setTranslate] = useState({
        x: 0,
        y: 0
    })

    const [cropLayerPosition, setCropLayerPosition] = useState<CursorPoint>()

    const textTool = new P5ToolsManager.TextTool()
    const circleTool = new P5ToolsManager.CircleTool()
    const squareTool = new P5ToolsManager.SquareTool()
    const lineTool = new P5ToolsManager.LineTool()
    const freehandTool = new P5ToolsManager.FreehandTool()
    const arrowLineTool = new P5ToolsManager.ArrowLineTool()
    const cropTool = new P5ToolsManager.CropTool()

    cropTool.startRect = (p) => {
        setCropLayerPosition(undefined)
    }
    cropTool.endRect = (p) => {
        setCropLayerPosition([p.startX, p.startY])
    }

    const getInfo: P5ToolGetInfo = async (tool: P5BaseTool<any>) => {
        const info = await editInfo()
        if (info) {

        } else {
            _.last(tool.annotations).remove()
        }
        return {
            ...info,
            time: new Date().getTime()
        }
    }

    const [toolsManager] = useState<P5ToolsManager>(() => {
        const toolsManager = new P5ToolsManager(getInfo)
        toolsManager
            .useTool(textTool)
            .useTool(circleTool)
            .useTool(squareTool)
            .useTool(lineTool)
            .useTool(freehandTool)
            .useTool(arrowLineTool)
            .useTool(cropTool)
        toolsManager
            .usePlugin(new P5ToolsManager.MovePlugin(), [circleTool, squareTool, textTool])
            .usePlugin(new P5ToolsManager.ScalePlugin(), [squareTool, circleTool])
        return toolsManager
    })

    useEffect(() => {
        if (sk) {
            const wrap = sk.createDiv()
            wrap.addClass('w-130px h-50px')
            // document.getElementById().appendChild(wrap.elt)
            render(
                <>
                    <button className='mr-10px w-50px h-30px' onClick={e => {
                        doCrop(e)
                    }}>确认</button>
                    <button className='w-50px h-30px' onClick={doCancel}>取消</button>
                </>,
                wrap.elt
            )

            setWrapper(wrap)
        }
    }, [sk])

    useEffect(() => {
        if (!wrapper) {
            return
        }
        if (cropLayerPosition) {
            wrapper.position(cropLayerPosition[0], cropLayerPosition[1] - 35)
            wrapper.show()
        } else {
            wrapper.hide()
        }
    }, [cropLayerPosition, wrapper])

    const draw = useCallback(() => {
        if (!sk || !image) {
            return
        }
        (sk as any).clear();
        sk.resizeCanvas(image.width * scale, image.height * scale, false)
        sk.image(image, translate.x, translate.y, image.width * scale, image.height * scale)
        toolsManager.draw(sk!, scale, translate.x, translate.y)
    }, [scale, sk, image, translate])

    useEffect(() => {
        if (sk && image) {
            sk.draw = draw
            sk.touchStarted = (event: any) => {
                if (event.target.nodeName === 'CANVAS') {
                    if (!dragging) {
                        toolsManager.touchStarted(sk)
                    }
                }
            }
            sk.touchMoved = (event: any) => {
                if (!dragging) {
                    toolsManager.touchMoved(sk)
                } else {
                    setTranslate({
                        x: translate.x + sk.mouseX - sk.pmouseX,
                        y: translate.y + sk.mouseY - sk.pmouseY
                    })
                }
            }
            sk.touchEnded = () => {
                if (!dragging) {
                    toolsManager.touchEnded(sk)
                    if (toolsManager.enabledTool?.name !== P5ToolsManager.CropTool.toolName) {
                        toolsManager.quitTool()
                    }
                }
            }

            sk.setup = () => {
                const viewerSize = {
                    x: 0,
                    y: 0
                }
                sk.createCanvas(viewerSize.x, viewerSize.y)
                toolsManager.setup(sk)
            }


            sk.mouseWheel = (event: any) => {
                if (event.target.nodeName === 'CANVAS') {
                    const temp = scale - event.deltaY / 100
                    setScale(Math.max(Math.min(temp, 5), 0.5))
                }
            }
        }
    }, [sk, image, draw, dragging])

    useEffect(() => {
        if (p5ref.current) {
            new P5((sk: P5) => {
                setSk(sk)
                sk.preload = () => {
                    sk.loadImage('https://picsum.photos/1200/600', t => {
                        console.log(t)
                        setImage(t)
                    })
                    toolsManager.preload(sk)
                }

            }, p5ref.current)
        }
    }, [])

    const doCancel = (e: any) => {
        setCropLayerPosition(undefined)
        const cropTool = toolsManager?.findTool(P5ToolsManager.CropTool.toolName) as CropTool
        cropTool.endCrop()
    }

    const doCrop = (e: any) => {
        setCropLayerPosition(undefined)
        const cropTool = toolsManager?.findTool(P5ToolsManager.CropTool.toolName) as CropTool
        cropTool.doCrop(sk!)
    }

    return (
        <div className='relative flex items-center justify-center w-screen h-screen overflow-hidden' id='test'>
            <div ref={p5ref} className='absolute left-0 right-0 top-0 bottom-0' />
            <Pannel manager={toolsManager} sk={sk} onChangeDragging={() => setDragging(!dragging)} dragging={dragging} />
        </div>
    )
}

export default App
