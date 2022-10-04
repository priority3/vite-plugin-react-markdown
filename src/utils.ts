import { cwd } from 'process'
import { dirname, isAbsolute, relative, resolve } from 'path'
import type { Arrayable, AttribsType, Nullable } from './type'
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
