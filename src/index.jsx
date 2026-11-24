import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'

import 'maplibre-gl/dist/maplibre-gl.css'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<App />)

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(registration => registration.unregister())
}
