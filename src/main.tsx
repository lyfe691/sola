/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Analytics } from "@vercel/analytics/react"
import { HelmetProvider } from 'react-helmet-async';

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
    <HelmetProvider>
      <App />
    </HelmetProvider>
    <Analytics />
  </React.StrictMode>
);

