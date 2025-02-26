

import tailwindconfig from 'frappe-ui/src/utils/tailwind.config.js'
export default {
  presets:[tailwindconfig],
  content: [
    './components/**/*.{ts,tsx,vue}',
    './src/**/*.{ts,tsx,vue}',
    './node_modules/frappe-ui/src/components/**/*.{vue,js,ts,jsx,tsx}',
    '../node_modules/frappe-ui/src/components/**/*.{vue,js,ts,jsx,tsx}'
    
	],

  plugins: []
}

