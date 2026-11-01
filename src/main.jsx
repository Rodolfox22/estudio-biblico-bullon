import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { initFieldTracker } from './voice/fieldTracker.js'
import './index.css'

initFieldTracker()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
