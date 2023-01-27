import React, { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { finalRoutes } from './router'
import LoadingPage from './pages/exception/Loading'
import { useBeforeunload } from './hooks/useBeforeunload'
import {
  systemTheme,
  setTheme,
  themeSelection,
  getTheme,
} from './common/utils/theme'

import './App.css'
import { ConfigProvider } from 'antd'
import zh_CN from 'antd/es/locale/zh_CN'

function App() {
  const router = createBrowserRouter(finalRoutes)

  useBeforeunload((evt) => {
    evt.preventDefault()
    console.log('success', evt)
    // return true
  })

  // 初始化主题
  useEffect(() => {
    const currSystemTheme = systemTheme()
    setTheme(currSystemTheme)
  }, [])

  return (
    <div className="app all:transition-200">
      <React.Suspense fallback={<LoadingPage />}>
        <ConfigProvider
          theme={{
            token: themeSelection[getTheme()],
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
