import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { finalRoutes } from './router'
import LoadingPage from './pages/exception/Loading'

import './App.css'
import { ConfigProvider, theme } from 'antd'
import zh_CN from 'antd/es/locale/zh_CN'
import { useBeforeunload } from './hooks/useBeforeunload'

function App() {
  const router = createBrowserRouter(finalRoutes)

  useBeforeunload((evt) => {
    evt.preventDefault()
    console.log('success', evt)
    return true
  })

  return (
    <div className="app">
      <React.Suspense fallback={<LoadingPage />}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#4f46e5',
            },
            algorithm: theme.defaultAlgorithm,
          }}
          locale={zh_CN}
        >
          <RouterProvider router={router} />
        </ConfigProvider>
      </React.Suspense>
    </div>
  )
}

export default App
