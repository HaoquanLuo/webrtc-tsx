import React, { useEffect, useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { finalRoutes } from './router'
import LoadingPage from './pages/exception/Loading'
import { useBeforeunload } from './hooks/useBeforeunload'
import { SystemThemeHandler } from './common/utils/theme'

import './App.css'
import { ConfigProvider } from 'antd'
import zh_CN from 'antd/es/locale/zh_CN'
import { useSelector } from 'react-redux'
import { selectSystemTheme } from './redux/features/system/systemSlice'

function App() {
  const router = createBrowserRouter(finalRoutes)

  const systemTheme = useSelector(selectSystemTheme)

  const [currSystemTheme, setCurrSystemTheme] = useState(
    SystemThemeHandler.getTheme(),
  )

  useBeforeunload((evt) => {
    evt.preventDefault()
    return true
  })

  // 初始化主题
  useEffect(() => {
    const initSystemTheme = SystemThemeHandler.systemTheme()
    setCurrSystemTheme(initSystemTheme)
    SystemThemeHandler.setTheme(initSystemTheme)
  }, [])

  useEffect(() => {
    setCurrSystemTheme(systemTheme)
  }, [systemTheme])

  return (
    <div className="app all:transition-200">
      <React.Suspense fallback={<LoadingPage />}>
        <ConfigProvider
          theme={{
            token: SystemThemeHandler.themeSelection[currSystemTheme],
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
