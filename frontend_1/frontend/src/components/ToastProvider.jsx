import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastProvider = ({ children }) => (
  <>
    {children}
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'rgba(18, 4, 11, 0.94)',
          color: '#fff',
          border: '1px solid rgba(255, 67, 101, 0.2)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.28)',
          fontFamily: 'Outfit, sans-serif',
        },
        success: {
          iconTheme: {
            primary: '#ff4b76',
            secondary: '#ffffff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ff2a4b',
            secondary: '#ffffff',
          },
        },
      }}
    />
  </>
);

export default ToastProvider;
