import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap styles
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Important for modal behavior
// import './index.css'
import App from './App.jsx'
import'./style/global.css';
import { TokenProvider } from './TokenProvider.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
      <TokenProvider>
          <App />
      </TokenProvider>
  </StrictMode>,
)
