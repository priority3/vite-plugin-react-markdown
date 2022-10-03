import MarkdownIt from 'markdown-it'
import type { TransformResult } from 'vite'
import type { MarkdownEnv, ResolvedOptions } from './type'
import { getImportComponents, toArray } from './utils'

export function createMarkdown(options: ResolvedOptions) {
  const markdown = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    ...options.markdownItOptions,
  })

  markdown.linkify.set({ fuzzyLink: false })

  options.markdownItUses.forEach((e) => {
    const [plugin, options] = toArray(e)
    markdown.use(plugin, options)
  })
  options.markdownItSetup(markdown)

  return (id: string, raw: string): TransformResult => {
    const { wrapperClasses, wrapperComponent, transforms } = options
    raw = raw.trimStart()
    if (transforms.before)
      raw = transforms.before(raw, id)

    const env: MarkdownEnv = { id }
    let html = markdown.render(raw, env)

    if (wrapperClasses) {
      html
        = `<div className="${wrapperClasses}">
          <React.Fragment>
            ${html}
          </React.Fragment> 
        </div>`
    }
    else { html = `<div>${html}</div>` }
    if (wrapperComponent)
      html = `<${wrapperComponent}$>${html}</${wrapperComponent}>`
    if (transforms.after)
      html = transforms.after(html, id)

    let importsCom = ''
    importsCom += getImportComponents(options.importComponentsPath)
      .filter(Boolean)
      .map(im => `import ${im} from ${options.importComponentsPath}/${im}`)
      .join('\n')
    let code = 'import react from \'react\'\n'
    code += `${importsCom}\n`
    code += `export default function Markdown() {\n
      return ${html} 
    }`

    return {
      code,
      map: {
        mappings: '',
      } as any,
    }
  }
}
