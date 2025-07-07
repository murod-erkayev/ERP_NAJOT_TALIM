import { createRoot } from 'react-dom/client'
import './assets/css/index.css'
import Router from './routes/routes.tsx'
createRoot(document.getElementById('root')!).render(
    <Router />
)
