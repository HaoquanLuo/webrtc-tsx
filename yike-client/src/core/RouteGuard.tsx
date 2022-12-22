import { getToken } from '@/common/utils/helpers/getTools'
import SystemLayout from '@/layout/SystemLayout'
import {
  setCurrentPath,
  selectRoomId,
} from '@/redux/features/system/systemSlice'
import { lazy, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'

// Vite 的懒加载需要用 import.meta.glob() 实现
const modules = import.meta.glob<{ default: React.FC }>('../pages/**/*.tsx')

// 快速导入工具函数
export const lazyLoad = (moduleName: string) => {
  const component = modules[`../pages/${moduleName}.tsx`]
  const Module = lazy(component)

  return <Module />
}

export const inAuth = new RegExp(/^\/auth(.*)/, 'gim')
export const inRoom = new RegExp(/^\/auth\/room\/(.*)/, 'gim')
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

  const roomId = useSelector(selectRoomId)

  const token = getToken()

  useEffect(() => {
    // 未登录且在 `/auth` 路径中
    if (!token && inAuth.test(pathname)) {
      navigate('/login', {
        replace: true,
      })
    }

    if (!roomId && inRoom.test(pathname)) {
      navigate('/', {
        replace: true,
      })
    }
  }, [pathname])

  useEffect(() => {
    dispatch(setCurrentPath(pathname))
  }, [pathname])

  const userView = <>{children}</>

  const guidelines = (
    <div grid place-items-center>
      <ul>
        <li>
          <Link to={'login'}>Sign In</Link>
        </li>
        <li>
          <Link to={'register'}>Sign Up</Link>
        </li>
      </ul>
    </div>
  )

  return <SystemLayout>{token ? userView : guidelines}</SystemLayout>
}
