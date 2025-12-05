import '@/styles/index.scss';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from "./App"
import { AuthContextProvider } from './context/AuthContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </StrictMode>
);