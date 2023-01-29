import { RouteObject } from 'react-router-dom'
import { AuthPaths, ExceptionPaths } from '@/common/constants/components'
import { lazyLoad } from '@/hooks/useRouteGuard'

/**
 * 权限路由
 */
export const authRoutesMap: RouteObject[] = [
  {
    path: '/main',
    element: lazyLoad(AuthPaths.Main),
  },
  {
    path: '/room/:roomId',
    element: lazyLoad(AuthPaths.Room),
  },
]
