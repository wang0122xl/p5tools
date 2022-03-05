/*
 * @Date: 2022-03-05 14:46:34
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-03-05 15:40:57
 * @Description: file content
 */
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
    mode: 'production',
    build: {
        sourcemap: true,
        lib: {
            entry: path.resolve(__dirname, 'libs/index.ts'),
            name: 'P5ToolsManager',
            formats: ['umd', 'es']
        },
        rollupOptions: {
            external: 'p5',
        },
        outDir: 'src'
    }    
})