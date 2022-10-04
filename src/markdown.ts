import MarkdownIt from 'markdown-it'
import { parseDocument } from 'htmlparser2'
import render from 'dom-serializer'
import frontMatter from 'front-matter'
import { transformSync } from '@babel/core'
import { Element } from 'domhandler'
import type { ChildNode } from 'domhandler'
import type { TransformResult } from 'vite'
import type { MarkdownEnv, ResolvedOptions } from './type'
import { getComponentPath, toArray, transformAttribs } from './utils'

const IMPORT_COM_REG = /<\s*?([A-Z][^</>\s]*)\s*?\/?>/g

function extractEscapeToReact(html: string) {
  return html.replace(/"vfm{{/g, '{{')
    .replace(/}}vfm"/g, '}}')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/<!--/g, '{/*')
    .replace(/-->/g, '*/}')
}

function getImportComInMarkdown(html: string, wrapperComponentName: string | null) {
  const whiteList = ['React.Fragment']
  wrapperComponentName && whiteList.push(wrapperComponentName)
  const importComs = []
  let match = IMPORT_COM_REG.exec(html)
  if (match && !whiteList.includes(match[1]))
    importComs.push(match[1])

  while (IMPORT_COM_REG.exec(html)) {
    match = IMPORT_COM_REG.exec(html)
    if (match && !importComs.includes(match[1]) && !whiteList.includes(match[1]))
      importComs.push(match[1])
  }

  return {
    importComs,
    html,
  }
}

export function createMarkdown(options: ResolvedOptions) {
  const markdown = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    xhtmlOut: true,
    ...options.markdownItOptions,
  })

  markdown.linkify.set({ fuzzyLink: false })

  options.markdownItUses.forEach((e) => {
    const [plugin, options] = toArray(e)
    markdown.use(plugin, options)
  })
  options.markdownItSetup(markdown)

  return (id: string, raw: string): TransformResult => {
    const {
      wrapperClasses,
      wrapperComponentName,
      wrapperComponentPath,
      importComponentsPath,
      transforms,
    } = options
    raw = raw.trimStart()
    const { body, attributes } = frontMatter(raw)
    const attributesString = JSON.stringify(attributes)
    if (transforms.before)
      raw = transforms.before(raw, id)

    const env: MarkdownEnv = { id }
    let html = markdown.render(body, env)
    const root = parseDocument(html, { lowerCaseTags: true })
    if (root.children.length) {
      Array.from(root.children).forEach((e) => {
        markCodeAsPre(e)
      })
    }
    const h = render(root, { selfClosingTags: true })
    html = extractEscapeToReact(h)
    // get import components
    const { importComs } = getImportComInMarkdown(html, wrapperComponentName)

    // set class
    if (wrapperClasses) {
      html
        = `<div className="${wrapperClasses}">
          <React.Fragment>
            ${html}
          </React.Fragment> 
        </div>`
    }
    else { html = `<div>${html}</div>` }

    // set wrapper component
    let wrapperComponentImp = ''
    if (wrapperComponentName && wrapperComponentPath) {
      const componentPath = getComponentPath(id, wrapperComponentPath)
      wrapperComponentImp = `import ${wrapperComponentName} from '${componentPath}'\n`
      html = `
        <${wrapperComponentName}>
          ${html}
        </${wrapperComponentName}>
      `
    }

    let markdownComponentsImp = ''
    const keys = Object.keys(importComponentsPath)
    if (importComs.length && keys.length) {
      importComs.forEach((e) => {
        if (keys.includes(e)) {
          const componentPath = getComponentPath(id, importComponentsPath[e])
          markdownComponentsImp += `import ${e} from '${componentPath}'\n`
        }
      })
    }

    const compiledReactCode = `
      export default function ReactMarkdown (props) {
        ${transformSync(html, {
          ast: false,
          presets: ['@babel/preset-react'],
          plugins: [],
        })!.code}
        return markdown
      }
    // `
    // const compiledReactCode = `
    //   export default function React__Markdown () {
    //     return (${html})
    //   }
    // `
    if (transforms.after)
      html = transforms.after(compiledReactCode, id)
    let code = 'import React from \'react\'\n'
    code += `${wrapperComponentImp}\n`
    code += `${markdownComponentsImp}\n`
    code += `${compiledReactCode}`
    code += `export const attributes = ${attributesString}`
    console.log('🚀 ~ file: markdown.ts ~ line 141 ~ return ~ code', code)

    return {
      code,
      map: {
        mappings: '',
      } as any,
    }
    function markCodeAsPre(node: ChildNode): void {
      if (node instanceof Element) {
        if (node.tagName)
          transformAttribs(node.attribs)
        if (node.tagName === 'code') {
          // const codeContent = render(node, { decodeEntities: true })
          // node.attribs.dangerouslySetInnerHTML = `vfm{{ __html: \`${codeContent.replace(/([\\`])/g, '\\$1')}\`}}vfm`
          // node.childNodes = []
        }
        if (node.childNodes.length) {
          node.childNodes.forEach((e) => {
            markCodeAsPre(e)
          })
        }
      }
    }
  }
}
