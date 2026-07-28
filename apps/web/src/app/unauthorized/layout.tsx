import type { ReactNode } from "react"

type UnauthorizedLayoutProps = {
  children: ReactNode
}

export default function UnauthorizedLayout({
  children,
}: UnauthorizedLayoutProps) {
  return <>{children}</>
}