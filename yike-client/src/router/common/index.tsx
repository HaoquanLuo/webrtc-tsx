import App from '@/App'
import AuthPage from '@/views/auth'
import Register from '@/views/auth/Register'
import Login from '@/views/auth/Login'
import CommonPage from '@/views/common'
import Main from '@/views/common/Main'
import Room from '@/views/common/Room'
import NotFound from '@/views/exception/NotFound'
import { RouteObject } from 'react-router-dom'

/**
 * 基础路由
 */
export const constantRouterMap: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/auth',
        element: <AuthPage />,
        children: [
          {
            path: '/auth/login',
            element: <Login />,
          },
          {
            path: '/auth/register',
            element: <Register />,
          },
        ],
      },
      {
        path: '/common',
        element: <CommonPage />,
        children: [
          {
            path: '/common/main',
            element: <Main />,
            loader: async () => {
              function load() {
                return Promise.resolve('gg')
              }
              let res = await load()
              return res
            },
          },
          {
            path: '/common/room',
            element: <Room />,
          },
          {
            path: '/common/room/:roomId',
            element: <Room />,
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFound /> },
]

export default [...constantRouterMap]
