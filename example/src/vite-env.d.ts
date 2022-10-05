/// <reference types="vite/client" />
declare module '*.md' {
  import type React from 'react'
  const ReactComponent: React.VFC
  export default ReactComponent
}
