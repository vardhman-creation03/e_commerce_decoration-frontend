'use client';

// ==========================================
// PROVIDERS - Simplified (No Auth)
// ==========================================
// All authentication removed - only Redux provider needed

import { Provider } from 'react-redux';
import { store } from './store/store';

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}
