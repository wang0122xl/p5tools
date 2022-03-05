/*
 * @Date: 2022-02-28 18:56:36
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-03-05 13:38:41
 * @Description: file content
 */

import { MouseEvent, useState } from "react"
import ReactDOM from "react-dom"
import './options.less'
import 'react-color'
import { P5ToolBaseInfo } from "libs/tools/baseTool"

const InfoLayer = (props: {
    info?: P5ToolBaseInfo
    onCancel: () => void
    onConfirm: (values: P5ToolBaseInfo) => void
}) => {
    const [info, setInfo] = useState<P5ToolBaseInfo | undefined>(props.info)

    return (
        <div className="w-250px bg-white flex flex-col p-20px children:(my-5px)">
             <p>标题: </p>
             <input value={info?.title || ''} onChange={e => setInfo({
                 ...info,
                 title: e.target.value
             })} />
             <p>备注: </p>
             <input value={info?.remark || ''} onChange={e => setInfo({
                 ...info,
                 remark: e.target.value
             })} />
             <p>其他信息: </p>
             <input value={info?.others || ''} onChange={e => setInfo({
                 ...info,
                 others: e.target.value
             })} />

             <div className="flex items-center mt-20px">
                 <button className="flex-1 mr-10px" onClick={() => {
                     props.onConfirm({
                         ...info,
                         time: new Date().getTime()
                     })
                 }}>确认</button>
                 <button className="flex-1" onClick={props.onCancel}>取消</button>
             </div>
        </div>
    )
}

const editInfo = (info?: P5ToolBaseInfo): Promise<P5ToolBaseInfo | false> => {
    return new Promise((resolve) => {
        let div = document.createElement('div')
        div.style.position = 'fixed'
        div.style.left = '0'
        div.style.right = '0'
        div.style.bottom = '0'
        div.style.top = '0'
        div.style.display = 'flex'
        div.style.alignItems = 'center'
        div.style.justifyContent = 'center'
        document.body.appendChild(div)

        const close = () => {
            ReactDOM.unmountComponentAtNode(div)
            document.body.removeChild(div)
            div = null as any
        }

        ReactDOM.render(
            <InfoLayer
                info={info}
                onCancel={() => {
                    close()
                    resolve(false)
                }}
                onConfirm={t => {
                    close()
                    resolve(t)
                }}
            />,
            div
        )
    })
}

export default editInfo
