import { createRoot } from 'react-dom/client'
import './assets/css/index.css'
import Router from './routes/routes.tsx'
import '@ant-design/v5-patch-for-react-19';
createRoot(document.getElementById('root')!).render(
    <Router />
)
