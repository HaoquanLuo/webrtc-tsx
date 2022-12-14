import { RouteObject } from 'react-router-dom'
import { lazyLoad } from '@/core/RouteGuard'
import { CommonPaths } from '@/common/constants/components'
import Login from '@/pages/common/Login'
import Register from '@/pages/common/Register'

/**
 * 基础路由
 */
export const constantRoutesMap: RouteObject[] = [
  {
    path: '/login',
    // element: lazyLoad(CommonPaths.Login),
    element: <Login />,
  },
  {
    path: '/register',
    // element: lazyLoad(CommonPaths.Register),
    element: <Register />,
  },
]
