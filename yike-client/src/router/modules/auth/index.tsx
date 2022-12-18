import { RouteObject } from 'react-router-dom'
import { AuthPaths, ExceptionPaths } from '@/common/constants/components'
import { lazyLoad } from '@/core/RouteGuard'

/**
 * 权限路由
 */
export const authRoutesMap: RouteObject[] = [
  {
    index: true,
    element: lazyLoad(AuthPaths.Main),
  },
  {
    path: '/auth/room/:roomId',
    element: lazyLoad(AuthPaths.Room),
  },
  {
    path: '*',
    element: lazyLoad(ExceptionPaths.Redirect),
    // element: <Redirect />,
  },
]
