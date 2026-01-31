'use client';

import { AuthProvider } from '../lib/context/auth-context';
import { Provider } from 'react-redux';
import { store } from './store/store';

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </Provider>
  );
}
