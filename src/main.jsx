import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
// CORRECCIÓN: Importamos el componente con el nombre real
import { ThemeController } from './components/ThemeController.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* CORRECCIÓN: Lo renderizamos adentro del Router, pero al lado de la App (no envolviéndola) */}
      <ThemeController />
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)