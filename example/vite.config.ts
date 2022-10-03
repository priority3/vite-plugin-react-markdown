import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vitePluginReactMarkdown from 'vite-plugin-react-markdown'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vitePluginReactMarkdown({
      importComponents: {
        dts: 'src/components/pages',
      },
    }),
  ],
})
