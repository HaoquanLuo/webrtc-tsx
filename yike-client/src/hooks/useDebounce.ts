import { useEffect, useState } from 'react'

export const useDebounceValue = (value: string, time = 150) => {
  const [debounceValue, setDebounceValue] = useState<string>(value)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value)
    }, time)

    return () => clearTimeout(timer)
  }, [value, time])
  return debounceValue
}
