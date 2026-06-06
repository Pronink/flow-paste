import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import './global.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPencil, faClose, faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

library.add(faPencil, faClose, faCircleHalfStroke, faGithub)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
