/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary project and is governed by the terms in LICENSE.
 * Unauthorized use, modification, or distribution is prohibited. All rights reserved.
 * For permissions, contact yanis.sebastian.zuercher@gmail.com
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

