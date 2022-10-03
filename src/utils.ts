import { cwd } from 'process'
import { resolve } from 'path'
import fs from 'fs-extra'
import type { Arrayable, Nullable, importComponentOptions } from './type'
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

export function getImportComponents(options: importComponentOptions): Array<String | undefined> {
  const importComponents: Array<String | undefined> = []
  toArray(options).forEach((item) => {
    const alph = /(\w)*/g.exec(item) || []
    importComponents.push(alph[alph?.length - 1])
  })

  return importComponents
}
