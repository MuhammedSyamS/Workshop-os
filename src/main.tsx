import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider, UserProvider, ToastProvider } from './context/AppContext.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import axios from 'axios';

// Global Axios Configuration
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

// Intercept responses to prevent hosting providers' SPA fallbacks (HTML pages) from being parsed as JSON arrays
axios.interceptors.response.use(
  (response) => {
    if (typeof response.data === 'string' && response.data.trim().toLowerCase().startsWith('<')) {
      console.error('API Error: Received an HTML response instead of JSON. The backend might be unreachable or VITE_API_URL is missing.');
      return Promise.reject(new Error('Received HTML response. Backend unreachable.'));
    }
    return response;
  },
  (error) => Promise.reject(error)
);

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
