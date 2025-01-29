import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import FontManager from './pages/FontManager.tsx'
import LayoutGlobal from './components/layouts/LayoutGlobal.tsx'

// setting router
const router = createBrowserRouter([{
  element: <LayoutGlobal />,
  children: [
    {
      path: '/',
      element: <App />,
    },
    {
      path: '/font-manager',
      element: <FontManager />,
    }
  ]
}
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
