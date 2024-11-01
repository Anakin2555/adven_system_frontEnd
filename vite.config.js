import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import * as path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),VueSetupExtend()
    ],

    server: {
        host: '0.0.0.0',
        port: 8083,
        open: true,
        hmr: true,
        usePolling: true,
        proxy:{
            '/api':{
                //target: 'http://43.136.132.87:9000/', // 需要跨域请求的地址或者IP
                target: 'http://127.0.0.1:9000/', // 需要跨域请求的地址或者IP
                changeOrigin: true, //  表示是否跨域
                pathRewrite: {
                    '^/api': '/api' // 表示需要rewrite重写的
                }
            },
            '/file':{
                target: 'http://127.0.0.1:9000/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/file'
                }
            }
        }
    },
    resolve: {
        alias: [{
            find: '@',
            replacement: path.resolve('./src')
        }]
    }

})