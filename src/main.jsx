import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { NostrProvider } from './context/NostrContext.jsx'; // Import NostrProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NostrProvider>
      <App />
    </NostrProvider>
  </StrictMode>,
)
