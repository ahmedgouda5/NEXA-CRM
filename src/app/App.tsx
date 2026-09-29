import { useEffect } from 'react'
import { AppProviders } from './AppProviders'
import { CommandMenu } from './shell/command-menu'
import { CreateDialogs } from './shell/create-dialogs'
import { EntityDrawers } from './shell/entity-drawers'
import { Sidebar } from './shell/sidebar'
import { Topbar } from './shell/topbar'
import { ViewRouter } from './shell/view-router'
import { AiAssistant } from '@/domains/ai'

export function App() {
  useEffect(() => {
    document.title = 'NEXA CRM'
  }, [])

  return (
    <AppProviders>
      <div className="app-shell">
        <Sidebar />
        <div className="app-content">
          <Topbar />
          <div className="app-scroll">
            <ViewRouter />
          </div>
        </div>
      </div>
      <CommandMenu />
      <CreateDialogs />
      <EntityDrawers />
      <AiAssistant />
    </AppProviders>
  )
}
