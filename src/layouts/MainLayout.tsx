import * as React from 'react'

type Props = {
  children: React.ReactNode
}

export default function MainLayout({ children }: Props) {
  return <div className="layout sidesheet">{children}</div>
}
