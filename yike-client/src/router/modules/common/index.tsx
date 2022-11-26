import { RouteObject } from 'react-router-dom'
import { lazyLoad } from '@/core/RouteGuard'
import { CommonPaths } from '@/router/constants'

/**
 * 基础路由
 */
export const constantRoutesMap: RouteObject[] = [
  {
    path: '/login',
    element: lazyLoad(CommonPaths.Login),
  },
  {
    path: '/register',
    element: lazyLoad(CommonPaths.Register),
  },
]
