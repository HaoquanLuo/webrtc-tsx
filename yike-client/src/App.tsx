import React, { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { finalRoutes } from './router'
import LoadingPage from './pages/exception/Loading'

import './App.css'
import { ConfigProvider } from 'antd'
import zh_CN from 'antd/es/locale/zh_CN'
import { useBeforeunload } from './hooks/useBeforeunload'
import { getItem, setItem } from './common/utils/storage'

const themeSelection: System.ThemeSelection<System.Theme> = {
  light: {
    colorPrimary: '#7c3aed',
    colorTextBase: '#232323',
    colorBgBase: '#ffffff',
    colorBorder: '#ffffff',
  },
  dark: {
    colorPrimary: '#7c3aed',
    colorTextBase: '#ffffff',
    colorBgBase: '#232323',
    colorBorder: '#232323',
  },
}

const systemTheme = () =>
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'

const getTheme = () => (getItem('theme') as System.Theme) || systemTheme()

const setTheme = (theme: System.Theme) => {
  setItem('theme', theme)
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export const toggleTheme = () =>
  setTheme(getTheme() === 'light' ? 'dark' : 'light')

function App() {
  const router = createBrowserRouter(finalRoutes)

  useBeforeunload((evt) => {
    evt.preventDefault()
    console.log('success', evt)
    // return true
  })

  // 初始化主题
  useEffect(() => {
    setTheme(getTheme())
  }, [])

  return (
    <div className="app">
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
