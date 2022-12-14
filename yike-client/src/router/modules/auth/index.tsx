import { RouteObject } from 'react-router-dom'
import { lazyLoad } from '@/core/RouteGuard'
import { AuthPaths, ExceptionPaths } from '@/common/constants/components'
import Room from '@/pages/auth/Room'
import Redirect from '@/pages/exception/Redirect'
import Main from '@/pages/auth/Main'

/**
 * 权限路由
 */
export const authRoutesMap: RouteObject[] = [
  {
    index: true,
    // element: lazyLoad(AuthPaths.Main),
    element: <Main />,
  },
  {
    path: '/auth/room/:roomId',
    // element: lazyLoad(AuthPaths.Room),
    element: <Room />,
  },
  {
    path: '*',
    // element: lazyLoad(ExceptionPaths.Redirect),
    element: <Redirect />,
  },
]
