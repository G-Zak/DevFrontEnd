import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider, useSelector } from 'react-redux'
import { store, type RootState } from './store'
import { setAuthToken } from './api/axios'

function AuthTokenSync() {
  const token = useSelector((state: RootState) => state.auth.token)

  useEffect(() => {
    setAuthToken(token)
  }, [token])

  return null
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthTokenSync />
      <App />
    </Provider>
  </StrictMode>
);