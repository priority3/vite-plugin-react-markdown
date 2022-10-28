import { cwd } from 'process'
import { dirname, isAbsolute, relative, resolve } from 'path'
import fs from 'fs-extra'
import pc from 'picocolors'
import type { Arrayable, AttribsType, Nullable, importComponentOptions } from './type'

const { existsSync, readdirSync } = fs

/**
 * Convert `Arrayable<T>` to `Array<T>`
 *
 * @category Array
 */
export function toArray<T>(array?: Nullable<Arrayable<T>>): Array<T> {
  array = array || []
  if (Array.isArray(array))
    return array

  return [array]
}

export function getComponentPath(id: string, componentPath: string): string {
  if (!isAbsolute(componentPath))
    componentPath = resolve(cwd(), componentPath)
  const t = relative(dirname(id), componentPath).replaceAll(/\\/g, '/')

  return t.startsWith('.') ? t : `./${t}`
}
const attribs = Object.entries(
  {
    class: 'className',
    tabindex: 'tabIndex',
  },
)
export function transformAttribs(elementAttribs: AttribsType): void {
  if (elementAttribs) {
    attribs.forEach((attrib) => {
      const [name, replaceName] = attrib
      if (elementAttribs[name]) {
        elementAttribs[replaceName] = elementAttribs[name]
        delete elementAttribs[name]
      }
    })
  }
}

export type ImportComType = importComponentOptions
export const DEFAULT_IMPORT_PATH = './src/components/pages'

export function getDefaultImportCom(importComs: string[]) {
  const defaultPath = resolve(cwd(), DEFAULT_IMPORT_PATH)
  const res: ImportComType = {}
  if (!existsSync(defaultPath) && !!importComs) {
    const componentsNames = importComs.join(' ')
    // eslint-disable-next-line no-console
    console.log(
      pc.yellow(`
        ⚠️ the md file had undefined component name \`${pc.bold(componentsNames)}\`
        No default import component path found, please set it manually.
      `),
    )

    return res
  }
  readdirSync(defaultPath, 'utf-8').forEach((comName) => {
    if (comName.endsWith('.tsx')) {
      const name = comName.replace('.tsx', '')
      res[name.replace(/^\S/, s => s.toUpperCase())] = `${DEFAULT_IMPORT_PATH}/${name}`
    }
  })

  return res
}
