/*
 * @Date: 2022-02-28 15:12:47
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-03-05 14:10:33
 * @Description: file content
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import WindiCSS from 'vite-plugin-windicss'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 3012
    },
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
            }
        }
    },
    build: {
        sourcemap: true
    },
    plugins: [
        react(),
        WindiCSS(),
    ]
})
