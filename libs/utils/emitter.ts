/*
 * @Date: 2022-02-25 15:31:22
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-02-25 15:50:24
 * @Description: file content
 */

import { EventEmitter } from "events";

// tool的enabled状态改变时触发，参数为是否所有enabled都为false
export const EMITTER_TOOLS_ALL_DISABLED = 'EMITTER_TOOLS_ALL_DISABLED'

// 当有tools的enabled设为true时触发，参数为设为true的tool name
export const EMITTER_TOOL_ENABLED = 'EMITTER_TOOL_ENABLED'

export default new EventEmitter()
