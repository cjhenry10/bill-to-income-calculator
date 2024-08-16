import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/root.tsx';
import { ThemeProvider } from './components/theme-provider.tsx';
import BillSplitter from './components/BillSplitter.tsx';
import CookiePolicy from './components/CookiePolicy.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '',
        element: <App />,
      },
      {
        path: 'equal-savings-calculator',
        element: <BillSplitter />,
      },
      {
        path: 'cookie-policy',
        element: <CookiePolicy />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
