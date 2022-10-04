import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}
export default function Page(props: Props) {
  const { children } = props

  return (
    <div>
      {children}
    </div>
  )
}
