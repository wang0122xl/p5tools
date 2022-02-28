/*
 * @Date: 2022-02-25 12:03:24
 * @Author: wang0122xl@163.com
 * @LastEditors: wang0122xl@163.com
 * @LastEditTime: 2022-02-25 17:04:34
 * @Description: file content
 */

class Logger {
    private debug: boolean = import.meta.env.NODE_ENV === 'development'
    
    public setDebug(debug: boolean) {
        this.debug = debug
    }

    public log(text: string) {
        console.log(text)
    }
}

export default new Logger()
