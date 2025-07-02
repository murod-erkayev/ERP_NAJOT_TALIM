import { createRoot } from 'react-dom/client'
import './assets/css/index.css'
import App from './App.tsx'
import Router from './routes/routes.tsx'
createRoot(document.getElementById('root')!).render(
    <Router />
)
