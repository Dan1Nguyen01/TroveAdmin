import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
// Bootstrap Bundle JS
import 'bootstrap/dist/js/bootstrap.bundle.min'
import { AuthProvider } from './context/AuthContext'
import {MusicProvider} from './context/MusicContext';
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <AuthProvider>
    <MusicProvider>
      <App />
    </MusicProvider>
  </AuthProvider>
)
