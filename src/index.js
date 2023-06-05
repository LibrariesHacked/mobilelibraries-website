import React from 'react'
import { createRoot } from 'react-dom/client';

import App from './App'

import * as serviceWorker from './serviceWorker'

import 'maplibre-gl/dist/maplibre-gl.css'

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App tab="home" />);

serviceWorker.unregister()
