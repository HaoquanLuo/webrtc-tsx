import { Location, NavigateFunction, RouteObject } from 'react-router-dom'
import { getToken } from '@/utils/helpers/getToken'

//递归查询对应的路由
function searchRouteDetail(
  pathname: string,
  routes: RouteObject[],
): RouteObject | null {
  // 遍历每个路由映射
  for (const route of routes) {
    // 若匹配则返回该路由
    if (route.path === pathname) {
      return route
    }
    // 有嵌套路由则递归遍历
    if (route.children) {
      const resultRoute = searchRouteDetail(pathname, route.children)
      // 找到路由（不为空）才返回
      if (resultRoute) {
        return resultRoute
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
export function guard(
  location: Location, //类型在react-router-dom中导入
  navigate: NavigateFunction,
  routes: RouteObject[],
) {
  const { pathname } = location
  console.log('location', location)
  const token = getToken()
  // 找到对应的路由信息，判断有没有权限控制
  const routeDetail = searchRouteDetail(pathname, routes)
  // console.log('routeDetail', routeDetail)
  //没有找到路由，跳转404
  if (!routeDetail) {
    // navigate('/404')
    return false
  }
  //如果路径需要权限验证
  if (!token) {
    const inAuth = new RegExp(/^\/auth(.*)/, 'gim')
    // 如果匹配路径 '/auth'
    if (pathname.match(inAuth)) {
      return false
    }
    if (pathname === '/' || pathname === '/login' || pathname === '/register') {
      return true
    }
    return false
  } else {
    if (pathname === '/login') {
      navigate('/auth')
    }
    return true
  }
}

/**
 * 路由守卫
 * @param routes
 * @returns
 */
// export const useRouterGuard = (routes: RouteObject[]) => {
//   // debugger
//   const location = useLocation()
//   const navigate = useNavigate()
//   const [isPassed, setIsPassed] = useState(false)

//   useEffect(() => {
//     let flag = false
//     if (!flag) {
//       setIsPassed(guard(location, navigate, routes))
//     }
//     return () => {
//       flag = true
//     }
//   }, [location, navigate, routes])

//   const RouterView = useRoutes(routes)
//   const res = isPassed ? RouterView : null
//   return res
// }
