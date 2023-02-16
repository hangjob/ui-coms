import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import pmVueLib2 from './plugins/pmVueLib2'
import path from 'path';

export default defineConfig({
    plugins: [vue(), pmVueLib2({versionType:'patch'})],
    optimizeDeps: {
        exclude: ['vue-demi']
    },
    resolve: {
        alias: {
            // 如果报错__dirname找不到，需要安装node,执行yarn add @types/node --save-dev
            '@': path.resolve(__dirname, 'src'),
            '__ROOT__': path.resolve(__dirname, ''),
        },
    },
    build: {
        outDir: 'lib',
        lib: {
            entry: path.resolve(__dirname, './src/packages/install.js'),
            name: 'PmUiComps',
            fileName: (format) => `v3.${format}.js`,
            formats: ['es', 'umd'],
        },
        rollupOptions: {
            external: ['vue', 'vue-demi'],
            output: {
                globals: {
                    vue: 'Vue',
                    "vue-demi": 'VueDemi'
                }
            }
        }
    }
})
