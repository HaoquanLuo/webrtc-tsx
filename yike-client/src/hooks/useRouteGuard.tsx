import React, { lazy, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import SystemLayout from '@/layout/SystemLayout'
import {
  setCurrentPath,
  selectRoomId,
} from '@/redux/features/system/systemSlice'
import { selectLogState } from '@/redux/features/user/userSlice'

// Vite 的懒加载需要用 import.meta.glob() 实现
const modules = import.meta.glob<{ default: React.FC }>('../pages/**/*.tsx')

// 快速导入工具函数
export const lazyLoad = (moduleName: string) => {
  const component = modules[`../pages/${moduleName}.tsx`]
  const Module = lazy(component)

  return <Module />
}

const inMain = new RegExp(/^\/main/, 'gi')
const inRoom = new RegExp(/^\/room\/(.*)/, 'gi')
const inIndex = new RegExp(/^\/$/)

/**
 * @description 路由鉴权组件
 * @param props
 * @returns
 */
export const RouteGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { pathname } = useLocation()

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const roomId = useSelector(selectRoomId)
  const logState = useSelector(selectLogState)

  useEffect(() => {
    // 未登录下的情况
    if (!logState) {
      if (inMain.test(pathname)) {
        navigate('/', {
          replace: true,
        })
      }
    }

    // 登录状态下的情况
    if (logState) {
      if (inIndex.test(pathname)) {
        navigate('/main', {
          replace: true,
        })
      }

      if (!roomId && inRoom.test(pathname)) {
        navigate('/main', {
          replace: true,
        })
      }
    }
  }, [pathname, logState])

  useEffect(() => {
    dispatch(setCurrentPath(pathname))
  }, [pathname])

  const View: React.FC<{ view: React.ReactNode }> = ({ view }) => <>{view}</>

  return (
    <SystemLayout>
      <View view={children} />
    </SystemLayout>
  )
}
