import { RouteObject } from 'react-router-dom'
import { CommonPaths } from '@/common/constants/components'
import { lazyLoad } from '@/core/RouteGuard'

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
