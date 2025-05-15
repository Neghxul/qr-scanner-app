
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import React from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <App />
    <Toaster position="top-right" reverseOrder={false} />
  </>
);