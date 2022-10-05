# vite-plugin-react-markdown

[![NPM version](https://img.shields.io/npm/v/@pity\/vite-plugin-react-markdown?color=a1b858)](https://www.npmjs.com/package/@pity/vite-plugin-react-markdown)

Compile Markdown to React component.

- Use Markdown as React components
- Use React components in Markdown

## 🐱‍🚀 Install

Install

```bash
ni @pity/vite-plugin-react-markdown -D 
# yarn/npm/pnpm add @pity/vite-plugin-react-markdown -D
```

Add it to `vite.config.js`

```js
/** .... */
import Markdown from '@pity/vite-plugin-react-markdown'
export default defineConfig({
  plugins: [
    react(),
    Markdown({
      wrapperComponentName: 'ReactMarkdown',
      wrapperComponentPath: './src/components/page',
      // if you want use components in md file, please add it in this
      // [ComponentName]: `componentPath`
      // 🐱‍🚀: the `ComponentName` must be `CamelCase`
      importComponentsPath: {
        ReactTest: './src/components/pages/mdtest',
      },
      // markdownItUses: [
      //   prism,
      // ],
    }),
  ],
})
```

And import it as a normal React component
```jsx
import Hello from './README.md'
function  App() {
  return (
    <div className="App">
      <Hello />
    </div>
  )
}
```

## 🐱‍🐉 Use React components in Markdown

You can even use React components inside your markdown, for example

```jsx
<ReactTest />
```


## 👾 Frontmatter

Frontmatter will be parsed,

For example:

```md
---
name: My Cool App
---

# Hello World

```

Will be rendered as

```html
<h1>Hello World</h1>
```

And you can use `frontmatter` in other and import it from this markdown file.

```jsx
import {attributes} from './README.md'
// attributes = {name: 'My Cool App'}
```

## Options

`@pity/vite-plugin-react-markdown` uses [`markdown-it`](https://github.com/markdown-it/markdown-it) under the hood, see [`markdown-it`'s docs](https://markdown-it.github.io/markdown-it/) for more details

```ts
// vite.config.js
import Markdown from '@pity/vite-plugin-react-markdown'

export default {
  plugins: [
    Markdown({
      // default options passed to markdown-it
      // see: https://markdown-it.github.io/markdown-it/
      markdownItOptions: {
        html: true,
        linkify: true,
        typographer: true,
      },
      // A function providing the Markdown It instance gets the ability to apply custom settings/plugins
      markdownItSetup(md) {
        // for example
        md.use(require('markdown-it-anchor'))
        md.use(require('markdown-it-prism'))
      },
      // Class names for the wrapper div
      wrapperClasses: 'markdown-body'
    })
  ],
}
```

See [the tsdoc](./src/types.ts) for more advanced options

## 🤷‍♂️ Example

See the [/example](./example).

## 🤷‍♀️ TypeScript Shim

```ts
declare module '*.md' {
  import type React from 'react'
  const ReactComponent: React.VFC
  export default ReactComponent
}
```


## 👏 Credits

This project is inspired by [vite-plugin-vue-markdown](https://github.com/antfu/vite-plugin-vue-markdown)
and mosts of code is from [geekris1/vite-plugin-react-markdown](https://github.com/geekris1/vite-plugin-react-markdown)

### Compare with it:
[geekris1/vite-plugin-react-markdown](https://github.com/geekris1/vite-plugin-react-markdown) is does'n work in wrapperComponent, and some style is not good.

## License

MIT License © 2022-PRESENT [Priority](https://github.com/priority3)
