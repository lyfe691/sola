import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Analytics } from "@vercel/analytics/react"; 
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
    <Analytics />
  </StrictMode>,
)
