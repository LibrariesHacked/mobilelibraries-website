import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<App />)

if ('serviceWorker' in navigator) {
  const unregisterServiceWorker = async () => {
    const registration = await navigator.serviceWorker.ready
    await registration.unregister()
  }
  unregisterServiceWorker()
}
