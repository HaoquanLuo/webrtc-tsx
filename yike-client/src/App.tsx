import React, { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SystemLayout from './layout/SystemLayout'
import { finalRoutes } from './router'
import LoadingPage from './pages/exception/Loading'

import './App.css'

function App() {
  const router = createBrowserRouter(finalRoutes)

  useEffect(() => {}, [])
  return (
    <div className="app" shadow-inset shadow-xl rd-2>
      <React.Suspense fallback={<LoadingPage />}>
        <SystemLayout>
          <RouterProvider router={router} />
        </SystemLayout>
      </React.Suspense>
    </div>
  )
}

export default App
