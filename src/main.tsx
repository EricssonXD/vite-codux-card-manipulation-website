import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// import './utilities/disable-rightclick'; // Importing this disables right click on the page 
import './utilities/disable-select'; // Importing this disables text selection on the page

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);


