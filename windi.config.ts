/*
 * @Date: 2022-02-28 16:49:57
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-02-28 16:51:21
 * @Description: file content
 */

import { defineConfig } from 'vite-plugin-windicss'

export default defineConfig({
    preflight: false,
    extract: {
        include: ['example/**/*.{tsx,less}']
    }
})