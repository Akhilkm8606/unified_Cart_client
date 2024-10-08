
import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from "react-dom/client"
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, persistor } from './components/Redux/store';
import { PersistGate } from 'redux-persist/integration/react';

const root = createRoot(document.getElementById('root')); // Use createRoot from "react-dom/client"

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
