import { useRef, useEffect } from 'react'

export const useMsgScrollToView = <T>(dep: T[]) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToView = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToView()
  }, [dep])

  return scrollRef
}
