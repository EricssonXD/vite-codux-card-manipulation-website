import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserHistory, createMemoryHistory, createRouter } from '@tanstack/react-router'

import './index.css';

import './utilities/disable-rightclick'; // Importing this disables right click on the page 
import './utilities/disable-select'; // Importing this disables text selection on the page

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance we use memory history for codux, for production use createBrowserHistory
const codux = true;

const history = codux ? createMemoryHistory({
    initialEntries: ['/'], // Pass your initial url
}) :
    createBrowserHistory();

const router = createRouter({ routeTree, history: history })

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
