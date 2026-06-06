import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider, UserProvider, ToastProvider } from './context/AppContext.tsx'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <UserProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </UserProvider>
  </ThemeProvider>
)
