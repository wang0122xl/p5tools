<!--
 * @Date: 2022-03-05 13:59:23
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-03-10 22:26:43
 * @Description: file content
-->
# p5tools
## common tools for p5

> demo for basic usage, [click here](wang0122xl.github.io/p5tools/)<br>
> cowork with openseadragon, [click hear](https://github.com/wang0122xl/p5tools-openseadragon-demo)

### install
` yarn add p5tools `

### usage
```javascript
const textTool = new P5ToolsManager.TextTool()
const toolsManager = new P5ToolsManager()
toolsManager.useTool(textTool)
toolsManager.usePlugin(new P5ToolsManager.ScalePlugin([textTool]))

new P5((sk: P5) => {
    sk.preload = () => {
        toolsManager.preload(sk)
    }
    sk.setup = () => {
        const viewerSize = {
            x: 1200,
            y: 600
        }
        sk.createCanvas(viewerSize.x, viewerSize.y)
        toolsManager.setup(sk)
    }
    sk.touchStarted = (event) => {
        if (event.target.nodeName === 'CANVAS') {
            toolsManager.touchStarted(sk, event)
        }
    }
    sk.touchMoved = (event: any) => {
        toolsManager.touchMoved(sk)
    }
    sk.touchEnded = () => {
        toolsManager.touchEnded(sk)
        toolsManager.quitTool()
    }

    toolsManager.setToolEnabled(P5ToolsManager.TextTool.toolName, {
        strokeColor: 'blue'
    })
}, document.getElementById('p5-div'))
```