import { getToken } from '@/common/utils/helpers/getTools'
import UserLayout from '@/layout/UserLayout'
import { setCurrentPath } from '@/redux/features/system/systemSlice'
import { lazy, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'

// 快速导入工具函数
export const lazyLoad = (moduleName: string) => {
  const Module = lazy(() => import(/* @vite-ignore */ `../pages/${moduleName}`))

  return <Module />
}

export const inAuth = new RegExp(/^\/auth(.*)/, 'gim')
export const inIndex = new RegExp(/^\/$/)

/**
 * @description 路由鉴权组件
 * @param props
 * @returns
 */
export const RouteGuard: React.FC<{ children: React.ReactElement }> = (
  props,
) => {
  const { children } = props
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const token = getToken()

  useEffect(() => {
    // 未登录且在 `/auth` 路径中
    if (!token && inAuth.test(pathname)) {
      navigate('/login', {
        replace: true,
      })
    }
  }, [pathname])

  useEffect(() => {
    dispatch(setCurrentPath(pathname))
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
