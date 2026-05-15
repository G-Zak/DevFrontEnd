import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider, useSelector } from 'react-redux'
import { store, type RootState } from './store'
import { setAuthToken } from './api/axios'

function Root() {
  const token = useSelector((s: RootState) => s.auth.token);
  useEffect(() => {
    setAuthToken(token);
  }, [token]);
  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Root />
    </Provider>
  </StrictMode>
);