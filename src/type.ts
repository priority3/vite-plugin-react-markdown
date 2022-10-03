import type { FilterPattern } from '@rollup/pluginutils'
import type MarkdownIt from 'markdown-it'

export type importComponentOptions = Object

export interface Options {
  /**
   * Parse for frontmatter
   *
   * @default true
   */
  // frontmatter?: boolean

  /**
   * Class names for wrapper div
   *
   * @default 'markdown-body'
   */
  wrapperClasses?: string | string[]

  /**
   * Component name to wrapper with
   *
   * @default undefined
   */
  wrapperComponent?: string | undefined | null

  /**
   * Components are contained in markdown
   */
  importComponentsPath?: importComponentOptions

  /**
   * Options passed to Markdown It
   */
  markdownItOptions?: MarkdownIt.Options

  /**
    * Plugins for Markdown It
    */
  markdownItUses?: (
    | MarkdownIt.PluginSimple
    | [MarkdownIt.PluginSimple | MarkdownIt.PluginWithOptions<any>, any]
    | any
  )[]

  /**
   * A function providing the Markdown It instance gets the ability to apply custom
   * settings/plugins
   */
  markdownItSetup?: (MarkdownIt: MarkdownIt) => void

  /**
   * Custom tranformations apply before and after the markdown transformation
   */
  transforms?: {
    before?: (code: string, id: string) => string
    after?: (code: string, id: string) => string
  }

  include?: FilterPattern
  exclude?: FilterPattern
}

export interface ResolvedOptions extends Required<Options> {
  wrapperClasses: string
}

export interface MarkdownEnv {
  id: string
}

/**
 * Array, or not yet
 */
export type Arrayable<T> = T | Array<T>

/**
 * Null or whatever
 */
export type Nullable<T> = T | null | undefined

