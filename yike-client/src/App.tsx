import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SystemLayout from './layout/SystemLayout'
import { finalRoutes } from './router'
import LoadingPage from './pages/exception/Loading'

import './App.css'
import { ConfigProvider } from 'antd'

function App() {
  const router = createBrowserRouter(finalRoutes)

  return (
    <div className="app">
      <React.Suspense fallback={<LoadingPage />}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#4f46e5',
            },
          }}
        >
          <SystemLayout>
            <RouterProvider router={router} />
          </SystemLayout>
        </ConfigProvider>
      </React.Suspense>
    </div>
  )
}

export default App
