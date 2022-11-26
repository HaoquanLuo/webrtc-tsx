import React, { lazy } from 'react'

export const useLazyComponent = (componentName: string) => {
  const LazyComponent = lazy(() => import(`/pages/${componentName}.tsx`))
  return <LazyComponent />
}
