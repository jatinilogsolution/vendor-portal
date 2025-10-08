
import { SidebarLayout } from '@/components/sidebar-layout'

import { PropsWithChildren } from 'react'
import { NavbarComponent } from './navbar'
import SidebarComponent from './sidebar'

export function SidebarLayoutComponent({ children }: PropsWithChildren) {
  return (
    <SidebarLayout
      navbar={
        <NavbarComponent />
      }
      sidebar={
        <SidebarComponent />
      }
    >
      {children}
    </SidebarLayout>
  )
}