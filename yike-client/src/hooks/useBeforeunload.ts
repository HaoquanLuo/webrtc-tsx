import React, { useEffect, useRef } from 'react'

const useBeforeunload = (fn: (e: Event) => void) => {
  const cbRef = useRef(fn)

  useEffect(() => {
    const onUnload = cbRef.current
    window.addEventListener('beforeunload', onUnload)

    return () => {
      window.removeEventListener('beforeunload', onUnload)
    }
  }, [cbRef])
}

export default useBeforeunload
