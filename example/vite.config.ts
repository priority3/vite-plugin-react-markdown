import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vitePluginReactMarkdown from 'vite-plugin-react-markdown'
import prism from 'markdown-it-prism'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vitePluginReactMarkdown({
      wrapperComponentName: 'ReactMarkdown',
      wrapperComponentPath: './src/components/page',
      importComponentsPath: {
        ReactTest: './src/components/pages/mdtest',
      },
      markdownItUses: [
        prism,
      ],
    }),
  ],
})
