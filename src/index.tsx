// main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import AppWithRouter from './App' // Corrected import path
import './index.css' //Corrected import path.

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWithRouter />
  </React.StrictMode>,
)
