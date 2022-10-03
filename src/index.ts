import type { Plugin } from 'vite'
import { createFilter } from '@rollup/pluginutils'
import { resloveOptions } from './options'
import type { Options } from './type'
import { createMarkdown } from './markdown'

function VitePluginReactMarkdown(userOptions: Options = {}): Plugin {
  const options = resloveOptions(userOptions)
  const markdownToReact = createMarkdown(options)
  const filter = createFilter(
    userOptions.include || /\.md$/,
    userOptions.exclude,
  )

  return {
    name: 'vite-plugin-react-markdown',
    enforce: 'pre',
    transform(raw, id) {
      if (!filter(id))
        return
      try {
        return markdownToReact(id, raw)
      }
      catch (e: any) {
        this.error(e)
      }
    },
    async handleHotUpdate(ctx) {
      if (!filter(ctx.file))
        return

      const defaultRead = ctx.read
      ctx.read = async function () {
        return markdownToReact(ctx.file, await defaultRead()).code
      }
    },
  }
}

export default VitePluginReactMarkdown
