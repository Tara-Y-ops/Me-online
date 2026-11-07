// App entry point: mounts the root React component into index.html.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ensureSignedIn } from './remote/supabase';
import { getAnonymousId } from './storage/localStore';
import './styles.css';

// Give this device its anonymous ID on first open (PRD FR-9.2).
getAnonymousId();
// Sign in to Supabase anonymously in the background; the app does not wait.
void ensureSignedIn();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found in index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
