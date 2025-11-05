import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterApp } from './router/RouterApp.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterApp />
  </AuthProvider>
)
