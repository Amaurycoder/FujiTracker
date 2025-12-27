import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { RecipeProvider } from './contexts/RecipeContext';
import { registerServiceWorker } from './utils/registerSW';
import './i18n'; // Initialize i18n

// Register service worker for PWA (disabled for development)
// registerServiceWorker();

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Router>
        <ThemeProvider>
          <RecipeProvider>
            <App />
          </RecipeProvider>
        </ThemeProvider>
      </Router>
    </React.StrictMode>
  );
} else {
  console.error('Failed to find the root element');
}
