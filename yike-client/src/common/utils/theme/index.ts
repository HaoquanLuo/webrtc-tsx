import { getItem, setItem } from '../storage'

export class SystemThemeHandler {
  static themeSelection: System.ThemeSelection<System.Theme> = {
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

  static systemTheme = () =>
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'

  static getTheme = () =>
    (getItem('theme') as System.Theme) || this.systemTheme()

  static setTheme = (theme: System.Theme) => {
    setItem('theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }

  static toggleTheme = () =>
    this.setTheme(this.getTheme() === 'light' ? 'dark' : 'light')
}
