import type { Options, ResolvedOptions } from './type'
import { toArray } from './utils'

export function resloveOptions(userOptions: Options): ResolvedOptions {
  const defaultOptions: ResolvedOptions = {
    // frontmatter: true,
    markdownItOptions: {},
    markdownItUses: [],
    markdownItSetup: () => {},
    importComponentsPath: {},
    wrapperComponentPath: '',
    transforms: {},
    wrapperClasses: 'markdown-body',
    wrapperComponentName: null,
    include: null,
    exclude: null,
  }

  const options = {
    ...defaultOptions,
    ...userOptions,
  }
  options.wrapperClasses = toArray(options.wrapperClasses)
    .filter((i?: string) => i)
    .join(' ')

  return options as ResolvedOptions
}
