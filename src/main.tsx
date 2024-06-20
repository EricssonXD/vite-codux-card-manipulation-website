import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { RouterProvider, createRouter } from '@tanstack/react-router'

import './index.css';

import './utilities/disable-rightclick'; // Importing this disables right click on the page 
import './utilities/disable-select'; // Importing this disables text selection on the page

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

// Render the app
const rootElement = (document.getElementById('root') as HTMLElement)
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>,
    )
}
