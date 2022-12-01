import { RouteObject } from 'react-router-dom'

export interface AuthRouteObject {
  caseSensitive?: boolean
  children?: RouteObject[]
  element?: React.ReactNode
  errorElement?: React.ReactNode
  index?: boolean
  path?: string
  auth?: boolean
}

type LoaderType = () => any | (() => Promise<any>)
export type RoutesItems = {
  path: string
  element: React.ReactElement
  errorElement?: React.ReactElement
  children?: RoutesItems[]
  loader?: LoaderType
  auth?: boolean
}
