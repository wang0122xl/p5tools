/*
 * @Date: 2022-02-25 15:31:22
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-03-03 20:52:03
 * @Description: file content
 */

import { EventEmitter } from "events";

/** plugin 活跃时触发，触发时将其余plugin设为非活跃状态 */
export const EMITTER_PLUGIN_ACTIVED = 'EMITTER_PLUGIN_ACTIVED'
/** 标注信息更改时触发 */
export const EMITTER_ANNOTATION_INFO_UPDATED = 'EMITTER_ANNOTATION_INFO_UPDATED'
/** crop 截取完成时触发 */
export const EMITTER_ANNOTATION_CROPPED = 'EMITTER_ANNOTATION_INFO_UPDATED'

export default new EventEmitter()
