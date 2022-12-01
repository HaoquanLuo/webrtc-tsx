import { getToken } from '@/common/utils/helpers/getToken'
import UserLayout from '@/layout/UserLayout'
import { lazy, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

// 快速导入工具函数
export const lazyLoad = (moduleName: string) => {
  const Module = lazy(
    () => import(/* @vite-ignore */ `../../pages/${moduleName}`),
  )

  return <Module />
}

// 路由鉴权组件
export const RouteGuard: React.FC<{ children: React.ReactElement }> = (
  props,
) => {
  const { children } = props
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const token = getToken()
  const inAuth = new RegExp(/^\/auth(.*)/, 'gim')

  useEffect(() => {
    // 未登录且在 `/auth` 路径中
    if (!token && pathname.match(inAuth)?.[0]) {
      navigate('/login', {
        replace: true,
      })
    }
  }, [pathname])

  const userView = <UserLayout>{children}</UserLayout>

  const guidelines = (
    <>
      <ul>
        <li>
          <Link to={'login'}>Sign In</Link>
        </li>
        <li>
          <Link to={'register'}>Sign Up</Link>
        </li>
      </ul>
    </>
  )

  return token ? userView : guidelines
}
