// App entry point: mounts the root React component into index.html.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { getAnonymousId } from './storage/localStore';
import './styles.css';

// Give this device its anonymous ID on first open (PRD FR-9.2).
getAnonymousId();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found in index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
