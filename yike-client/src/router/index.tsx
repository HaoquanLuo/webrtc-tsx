import { RouteObject } from 'react-router-dom'
import { RouteGuard } from '@/hooks/useRouteGuard'
import { authRoutesMap } from './modules/auth'
import CommonPage from '@/pages/common'
import NotFound from '@/pages/exception/NotFound'
import Redirect from '@/pages/exception/Redirect'
import { constantRoutesMap } from './modules/common'

export const finalRoutes: RouteObject[] = [
  {
    path: '/',
    element: <RouteGuard children={<CommonPage />} />,
    errorElement: <NotFound />,
    children: [
      ...authRoutesMap,
      ...constantRoutesMap,
      { path: '/redirect', element: <Redirect /> },
    ],
  },
  { path: '*', element: <NotFound /> },
]
