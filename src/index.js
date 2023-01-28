import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

import * as serviceWorker from './serviceWorker'

import 'maplibre-gl/dist/maplibre-gl.css'

ReactDOM.render(<App />, document.getElementById('root'))

serviceWorker.unregister()
