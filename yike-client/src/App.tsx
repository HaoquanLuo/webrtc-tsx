import { Link, Outlet, useLocation } from 'react-router-dom'
import './App.css'
import common from './router/common'
import { RouterGuard } from './hooks/useRouterGuard'

function App() {
  const rootPath = '/'
  const location = useLocation()

  return (
    <div className="app">
      <h1>Hello There!</h1>
      {rootPath === location.pathname && (
        <ul>
          <li>
            <Link to={'/auth/login'}>Sign In</Link>
          </li>
          <li>
            <Link to={'/auth/register'}>Sign Up</Link>
          </li>
        </ul>
      )}
      {RouterGuard(common) && <Outlet />}
    </div>
  )
}

export default App
