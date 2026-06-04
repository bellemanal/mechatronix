import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import AuthProvider from './features/auth/AuthProvider.jsx'
import './styles/globals.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#111120',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.08)',
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#00cc44', secondary: '#080810' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#080810' },
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
