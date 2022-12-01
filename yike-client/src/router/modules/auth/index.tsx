import { RouteObject } from 'react-router-dom'
import { lazyLoad } from '@/core/RouteGuard'
import { AuthPaths, ExceptionPaths } from '@/common/constants/components'

/**
 * 权限路由
 */
export const authRoutesMap: RouteObject[] = [
  {
    index: true,
    element: lazyLoad(AuthPaths.Main),
  },
  {
    path: '/auth/room',
    element: lazyLoad(AuthPaths.Room),
  },
  {
    path: '/auth/room/:roomId',
    element: lazyLoad(AuthPaths.Room),
  },
  {
    path: '*',
    element: lazyLoad(ExceptionPaths.Redirect),
  },
]
