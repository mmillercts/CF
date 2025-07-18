import React from 'react';
import ReactDOM from 'react-dom/client'; // Use react-dom/client for createRoot
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Target element
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);