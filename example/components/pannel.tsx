/*
 * @Date: 2022-02-28 18:40:59
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-03-07 14:52:20
 * @Description: file content
 */
import { MouseEvent, useEffect, useState } from 'react'
import chooseOptions from './choose-options'
import './pannel.less'
import P5ToolsManager from '../../libs/manager'
import P5 from 'p5'
import emitter, { EMITTER_ANNOTATION_CROPPED, EMITTER_ANNOTATION_INFO_UPDATED } from '../../libs/utils/emitter'
import { P5ToolAnnotation, P5ToolBaseInfo } from 'libs/tools/baseTool'
import moment from 'moment'
import editInfo from './edit-info'
import CropTool from 'libs/tools/cropTool'

const Pannel = (props: {
    manager: P5ToolsManager
    sk?: P5,
    onChangeDragging: () => void
    dragging: boolean
}) => {
    const [showAnnotations, setShowAnnotations] = useState(true)
    const [annotations, setAnnotations] = useState<P5ToolAnnotation[]>([])

    const [showImages, setShowImages] = useState(false)
    const [images, setImages] = useState<{
        info: P5ToolBaseInfo,
        url: string
    }[]>([])

    const sortFunc = (a: any, b: any) => {
        const aTime = moment(a.info.time)
        const bTime = moment(b.info.time)
        if (aTime.isAfter(bTime)) {
            return -1
        } else {
            return 1
        }
    }

    const getAnnotations = () => {
        const temp = props.manager
            .getAllAnnotations()
            .sort(sortFunc)
        setAnnotations(temp)
    }
    const getImages = () => {
        const cropTool = props.manager.findTool(P5ToolsManager.CropTool.toolName) as CropTool
        const temp = cropTool.images.sort(sortFunc)
        setImages([...temp])
    }

    useEffect(() => {
        emitter.on(EMITTER_ANNOTATION_INFO_UPDATED, getAnnotations)
        emitter.on(EMITTER_ANNOTATION_CROPPED, getImages)
        return () => {
            emitter.removeListener(EMITTER_ANNOTATION_INFO_UPDATED, getAnnotations)
            emitter.removeListener(EMITTER_ANNOTATION_CROPPED, getImages)
        }
    }, [])

    const selectTool = async (e: MouseEvent, toolName: string) => {
        try {
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
        } catch (e) {
            props.manager.quitTool()
        }

    }

    const doCrop = () => {
        props.sk?.cursor(props.sk.CROSS)

        props.manager.setToolEnabled(P5ToolsManager.CropTool.toolName, {
            strokeColor: 'blue'
        })
    }

    const doEdit = async (anno: P5ToolAnnotation) => {
        const info = await editInfo(anno.info)
        if (info) {
            anno.info = info
            getAnnotations()
        }
    }

    const doDelete = (anno: P5ToolAnnotation) => {
        anno.remove()
        getAnnotations()
    }

    const deleteImage = (img: {
        info: P5ToolBaseInfo,
        url: string
    }) => {
        const cropTool = props.manager.findTool(P5ToolsManager.CropTool.toolName) as CropTool
        const index = cropTool.images.indexOf(img)
        cropTool.images.splice(index, 1)
        getImages()
    }

    return (
        <>
            <div className="common-pannel pannel">
                <p onClick={e => selectTool(e, P5ToolsManager.CircleTool.toolName)}>圆形</p>
                <p onClick={e => selectTool(e, P5ToolsManager.SquareTool.toolName)}>方形</p>
                <p onClick={e => selectTool(e, P5ToolsManager.TextTool.toolName)}>文字</p>
                <p onClick={e => selectTool(e, P5ToolsManager.LineTool.toolName)}>直线</p>
                <p onClick={e => selectTool(e, P5ToolsManager.ArrowLineTool.toolName)}>箭头</p>

                <p onClick={e => selectTool(e, P5ToolsManager.FreehandTool.toolName)}>freehand</p>
                <p onClick={e => doCrop()}>裁剪</p>
                <p onClick={e => {
                    if (!showAnnotations) {
                        setShowImages(false)
                    }
                    setShowAnnotations(!showAnnotations)
                }}>{showAnnotations ? '隐藏标注' : '显示标注'}</p>
                <p onClick={e => {
                    if (!showImages) {
                        setShowAnnotations(false)
                    }
                    setShowImages(!showImages)
                }}>{showImages ? '隐藏截图' : '显示截图'}</p>
                <p onClick={e => props.onChangeDragging()}>{props.dragging ? '取消拖动' : '拖动'}</p>

            </div>
            {
                showAnnotations && <div className='common-pannel annotations-layer'>
                    <div className='title outer sticky top-0 bg-white'>
                        标注信息
                    </div>
                    {
                        annotations.map(anno => {
                            if (anno.belong === P5ToolsManager.CropTool.toolName) {
                                return null
                            }
                            return (
                                <div key={`annotation-${anno.info.time}`} className='items-center outer'>
                                    <span className='text-15px font-500'>{anno.belong}</span>
                                    <div className='flex flex-col space-y-5px !py-5px flex-1 !mx-15px w-0'>
                                        <span>标题: {anno.info.title}</span>
                                        <span>备注: {anno.info.remark}</span>
                                        <span>其他信息: {anno.info.others}</span>
                                        <span>时间: {moment(anno.info.time).format('DD HH:mm:ss')}</span>
                                    </div>

                                    <div className='flex flex-col space-y-10px children:(h-25px)'>
                                        <button onClick={() => doEdit(anno)}>编辑</button>
                                        <button onClick={() => doDelete(anno)}>删除</button>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            }
            {
                showImages && (
                    <div className='common-pannel images-layer'>
                        <div className='title outer sticky top-0 bg-white'>
                            截图
                        </div>
                        {
                            images.map((img, index) => (<div className='flex flex-col space-y-5px outer' key={`image-${img.info.time}`}>
                                <span className='font-500 text-15px'>标题: {img.info.title}</span>
                                <span>时间: {moment(img.info.time).format('YYYY-MM-DD HH:mm')}</span>
                                <div className='flex items-center !mx-0 !py-0'>
                                    <img className='flex-1 w-0 mr-10px' src={img.url} />
                                    <button onClick={() => deleteImage(img)}>删除</button>
                                </div>
                            </div>))
                        }
                    </div>
                )
            }
        </>
    )
}

export default Pannel
