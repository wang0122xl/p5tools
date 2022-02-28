/*
 * @Date: 2022-02-28 18:56:36
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-02-28 20:32:17
 * @Description: file content
 */

import { MouseEvent, useState } from "react"
import ReactDOM from "react-dom"
import './options.less'
import { CirclePicker } from 'react-color'
import 'react-color'

type Option = {
    strokeWidth: number
    strokeAlpha: number
    strokeColor: string
}
const Options = (props: {
    rect: DOMRect
    onCancel: () => void
    onConfirm: (values: Option) => void
}) => {
    const [strokeWidth, setStrokeWidth] = useState('2')
    const [strokeAlpha, setStrokeAlpha] = useState('1')
    const [strokeColor, setStrokeColor] = useState<string>('#f44336')
    return (
        <div className="options" style={{
            top: props.rect.top,
            left: props.rect.left - 290
        }}>
             <p>画笔粗细：</p>
             <input value={strokeWidth} onChange={e => setStrokeWidth(e.target.value)} />
             <p>透明度：</p>
             <input value={strokeAlpha} onChange={e => setStrokeAlpha(e.target.value)} />
             <div>
             <CirclePicker color={strokeColor} onChange={c => setStrokeColor(c.hex)} />
             </div>

             <div className="flex items-center mt-20px">
                 <button className="flex-1 mr-10px" onClick={() => {
                     props.onConfirm({
                         strokeWidth: parseFloat(strokeWidth) || 2,
                         strokeAlpha: parseFloat(strokeAlpha) || 1,
                         strokeColor
                     })
                 }}>确认</button>
                 <button className="flex-1" onClick={props.onCancel}>取消</button>
             </div>
        </div>
    )
}

const chooseOptions = (e: MouseEvent): Promise<Option> => {
    const rect = (e.target as HTMLParagraphElement).getBoundingClientRect()
    return new Promise((resolve, reject) => {
        let div = document.createElement('div')
        div.style.position = 'fixed'
        div.style.left = '0'
        div.style.right = '0'
        div.style.bottom = '0'
        div.style.top = '0'
        document.body.appendChild(div)

        const close = () => {
            ReactDOM.unmountComponentAtNode(div)
            document.body.removeChild(div)
            div = null as any
            reject()
        }

        ReactDOM.render(
            <Options
                rect={rect}
                onCancel={close}
                onConfirm={t => {
                    resolve(t)
                    close()
                }}
            />,
            div
        )
    })
}

export default chooseOptions
