import { migrateMobileBrowserStorage } from './services/brandStorageMigration';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/reset.scss';
import '@starmate/theme-openbitfun/default.css';
import '@starmate/ui/mobile.css';
import App from './App';
import { installTextInputGuard } from '../../shared/text-input/textInputGuard';

const removeTextInputGuard = installTextInputGuard(document);
if (import.meta.hot) import.meta.hot.dispose(removeTextInputGuard);

migrateMobileBrowserStorage();
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
