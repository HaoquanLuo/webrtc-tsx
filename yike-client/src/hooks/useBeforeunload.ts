import { useEffect } from 'react'

export const useBeforeunload = (fn: (evt: BeforeUnloadEvent) => any) => {
  const handleBeforeunload = (evt: BeforeUnloadEvent) => {
    let returnValue: boolean = fn(evt)

    if (returnValue) {
      evt.preventDefault()
      evt.returnValue = returnValue
    }

    return returnValue
  }

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeunload)

    return () => window.removeEventListener('beforeunload', handleBeforeunload)
  }, [fn])
}
