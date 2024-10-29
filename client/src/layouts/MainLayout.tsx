import * as React from 'react'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <div className="layout sidesheet">{children}</div>
}
