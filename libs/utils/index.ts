/*
 * @Date: 2022-02-25 17:53:30
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-02-25 17:56:57
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

export {
    distanceBetween
}