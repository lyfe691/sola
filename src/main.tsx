import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// get the root element
const rootElement = document.getElementById('root');

// small safety check
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

// create root 
const root = createRoot(rootElement);

// render app with strict mode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
