import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider, UserProvider, ToastProvider } from './context/AppContext.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <ThemeProvider>
      <UserProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </UserProvider>
    </ThemeProvider>
  </ErrorBoundary>
)
