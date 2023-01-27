import { getItem, setItem } from '../storage'

export const themeSelection: System.ThemeSelection<System.Theme> = {
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

export const systemTheme = () =>
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'

export const getTheme = () =>
  (getItem('theme') as System.Theme) || systemTheme()

export const setTheme = (theme: System.Theme) => {
  setItem('theme', theme)
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export const toggleTheme = () =>
  setTheme(getTheme() === 'light' ? 'dark' : 'light')
