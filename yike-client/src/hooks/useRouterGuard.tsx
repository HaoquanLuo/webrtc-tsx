import {
  Location,
  NavigateFunction,
  RouteObject,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { getItem } from '@/utils/storage'
import { useState, useEffect } from 'react'

//递归查询对应的路由
function searchRouteDetail(
  pathname: string,
  routes: RouteObject[],
): RouteObject | null {
  console.log('routes', routes)
  for (const route of routes) {
    console.log('route', route)
    if (route.path === pathname) {
      console.log('found route')
      return route
    }
    if (route.children) {
      const res = searchRouteDetail(pathname, route.children)
      if (res) {
        return res
      }
    }
  }
  return null
}

/**
 * 全局路由守卫
 * @param location
 * @param routes
 */
function guard(
  location: Location, //类型在react-router-dom中导入
  navigate: NavigateFunction,
  routes: RouteObject[],
) {
  const { pathname } = location
  // 找到对应的路由信息，判断有没有权限控制
  const routeDetail = searchRouteDetail(pathname, routes)
  console.log('routeDetail', routeDetail)
  //没有找到路由，跳转404
  if (!routeDetail) {
    navigate('/404')
    return false
  }

  const token = getItem('token')
  console.log('token', token)
  //如果路径需要权限验证
  if (!token) {
    if (pathname === '/') {
      return true
    }
    const inAuth = new RegExp(/\/auth(.*)/, 'gim')
    // 如果匹配路径 '/auth'
    if (pathname.match(inAuth)) {
      return true
    }
    navigate('/')
    return false
  }
  return true
}

/**
 * 路由守卫
 * @param routes
 * @returns
 */
export const RouterGuard = (routes: RouteObject[]) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isPassed, setIsPassed] = useState(false)
  useEffect(() => {
    setIsPassed(guard(location, navigate, routes))
  }, [location, navigate, routes])

  return isPassed
}
