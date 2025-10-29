import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HeroUIProvider } from '@heroui/react'
import { QueryProvider } from './shared/providers/QueryProvider'
import './index.css'
import {App} from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <HeroUIProvider>
        <App />
      </HeroUIProvider>
    </QueryProvider>
  </StrictMode>,
)