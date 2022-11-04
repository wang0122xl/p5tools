/*
 * @Date: 2022-02-25 17:53:30
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-11-03 13:12:24
 * @Description: file content
 */
import P5 from 'p5'

export type CursorPoint = [x: number, y: number]

function distanceBetween(start: CursorPoint, end: CursorPoint) {
    const sum = Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2)

    return Math.pow(
        sum,
        1 / 2
    )
}

function degreeBetween(start: CursorPoint, end: CursorPoint, mode?: 'RADIANS' | 'DEGREES') {
    const radian = Math.atan2(start[1] - end[1], start[0] - end[0])
    if (mode !== 'DEGREES') {
        return radian
    }
    const angle = 180 / Math.PI * radian
    return angle
}

/**
 * @description: 根据三点计算夹角
 * @param {CursorPoint} 起始点
 * @param {CursorPoint} 夹角点
 * @param {CursorPoint} 终止点
 * @return {*}
 */
function calculateAngle(start: CursorPoint, center: CursorPoint, end: CursorPoint) {
    
        var a = Math.sqrt(Math.pow(start[0] - center[0], 2) + Math.pow(start[1] - center[1], 2));
        var b = Math.sqrt(Math.pow(end[0] - center[0], 2) + Math.pow(end[1] - center[1], 2));
        var c = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2));
        var cosA = (
            Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2)
        ) / (
            2 * a * b
        )
        const angle = Math.round( Math.acos(cosA) * 180 / Math.PI )
        return angle
}

function promisifyToBlob(canvas: HTMLCanvasElement, type?: string, quality?: number): Promise<Blob | null> {
    return new Promise(resolve => {
        canvas.toBlob(blob => {
            resolve(blob)
        }, type, quality)
    })
}

export {
    distanceBetween,
    degreeBetween,
    promisifyToBlob,
    calculateAngle
}