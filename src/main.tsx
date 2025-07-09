import { createRoot } from 'react-dom/client'
import './assets/css/index.css'
import Router from './routes/routes.tsx'
import {QueryClient,QueryClientProvider,} from '@tanstack/react-query'
import '@ant-design/v5-patch-for-react-19';
const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <Router />
    </QueryClientProvider>
)
