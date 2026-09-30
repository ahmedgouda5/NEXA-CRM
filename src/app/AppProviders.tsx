import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/shared/theme/theme-provider'
import { TooltipProvider } from '@/shared/ui/tooltip'
import { Toaster } from '@/shared/ui/sonner'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <TooltipProvider delayDuration={200}>
          {children}
          <Toaster position="bottom-center" />
        </TooltipProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
