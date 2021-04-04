import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

import * as serviceWorker from './serviceWorker'

import 'mapbox-gl/dist/mapbox-gl.css'

ReactDOM.render(<App />, document.getElementById('root'))

serviceWorker.unregister()
