import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import frappeui from 'frappe-ui/vite'
import Icons from "unplugin-icons/vite";
import Components from "unplugin-vue-components/vite";
import IconsResolver from "unplugin-icons/resolver"; 
import LucideIcons from "./lucide";
import tailwind from 'tailwindcss'
import vueJsx from '@vitejs/plugin-vue-jsx';

import autoprefixer from 'autoprefixer'

export default defineConfig({

  /* css: {
    postcss: {
      plugins: [
        tailwind(), 
        autoprefixer()],

    },
  }, */
  plugins: [
    frappeui(),
    vue(),
    vueJsx(),
    Components({
      dirs:["src/components",'node_modules/frappe-ui/src/components'],
      resolvers:[IconsResolver()]
      
    }),
    Icons({
      compiler: "vue3",
      autoInstall: true
        }),
              
    
  ],
 
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
		include: ['frappe-ui > feather-icons', 'showdown', 'engine.io-client',"tailwind.config.js"],
	}
})