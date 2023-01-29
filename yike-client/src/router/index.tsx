import { RouteObject } from 'react-router-dom'
import { RouteGuard, lazyLoad } from '@/hooks/useRouteGuard'
import { authRoutesMap } from './modules/auth'
import CommonPage from '@/pages/common'
import { ExceptionPaths } from '@/common/constants/components'

export const finalRoutes: RouteObject[] = [
  {
    path: '/',
    element: <RouteGuard children={<CommonPage />} />,
    errorElement: lazyLoad(ExceptionPaths.NotFound),
    children: [
      ...authRoutesMap,
      { path: '/redirect', element: lazyLoad(ExceptionPaths.Redirect) },
    ],
  },
  { path: '*', element: lazyLoad(ExceptionPaths.NotFound) },
]
