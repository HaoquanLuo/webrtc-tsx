import React, { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import UserLayout from './layout/UserLayout'
import { finalRoutes } from './router'
import LoadingPage from './pages/exception/Loading'

import './App.css'

function App() {
  const router = createBrowserRouter(finalRoutes)

  useEffect(() => {}, [])
  return (
    <div className="app">
      <UserLayout>
        <React.Suspense fallback={<LoadingPage />}>
          <RouterProvider router={router} />
        </React.Suspense>
      </UserLayout>
    </div>
  )
}

export default App
