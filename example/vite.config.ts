import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Markdown from '@pity/vite-plugin-react-markdown'
import prism from 'markdown-it-prism'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Markdown({
      wrapperComponentName: 'ReactMarkdown',
      wrapperComponentPath: './src/components/page',
      // importComponentsPath: {
      //   Mdtest: './src/components/pages/mdtest',
      // },
      markdownItUses: [
        prism,
      ],
    }),
  ],
})
