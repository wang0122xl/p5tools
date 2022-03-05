/*
 * @Date: 2022-02-28 18:56:36
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-03-05 13:38:31
 * @Description: file content
 */

import { MouseEvent, useState } from "react"
import ReactDOM from "react-dom"
import './options.less'
import { CirclePicker } from 'react-color'
import 'react-color'

type Option = {
    width: number
    alpha: number
    color: string
}
const Options = (props: {
    rect: DOMRect
    onCancel: () => void
    onConfirm: (values: Option) => void
}) => {
    const [width, setWidth] = useState('2')
    const [alpha, setAlpha] = useState('1')
    const [color, setColor] = useState<string>('#f44336')
    return (
        <div className="options" style={{
            top: props.rect.top,
            left: props.rect.left - 290
        }}>
             <p>画笔粗细：</p>
             <input value={width} onChange={e => setWidth(e.target.value)} />
             <p>透明度：</p>
             <input value={alpha} onChange={e => setAlpha(e.target.value)} />
             <div>
             <CirclePicker color={color} onChange={c => setColor(c.hex)} />
             </div>

             <div className="flex items-center mt-20px">
                 <button className="flex-1 mr-10px" onClick={() => {
                     props.onConfirm({
                         width: parseFloat(width) || 2,
                         alpha: parseFloat(alpha) || 1,
                         color
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
        }

        ReactDOM.render(
            <Options
                rect={rect}
                onCancel={() => {
                    close()
                    reject()
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

export default chooseOptions
