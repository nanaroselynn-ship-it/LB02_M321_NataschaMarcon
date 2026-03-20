import { defineConfig } from 'vite' // import helper function to define config
import react from '@vitejs/plugin-react'  // import react plugin so vite understands JSX

export default defineConfig({
  plugins: [react()],    // use react plugin enables react features JSX fast refresh 
})