/*
 * @Date: 2022-02-25 17:53:30
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-03-01 09:54:36
 * @Description: file content
 */

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

export {
    distanceBetween,
    degreeBetween
}