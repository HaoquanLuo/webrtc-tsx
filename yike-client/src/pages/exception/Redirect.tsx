import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectLogState } from '@/redux/features/user/userSlice'

const Redirect: React.FC = () => {
  const navigate = useNavigate()
  const logState = useSelector(selectLogState)
  const pathToGo = logState ? '/main' : '/'

  useEffect(() => {
    setTimeout(() => {
      navigate(pathToGo)
    }, 1000)
  }, [])

  return (
    <div
      fixed
      top-0
      bottom-0
      left-0
      right-0
      w-full
      h-full
      grid
      place-items-center
      text-center
    >
      <div>
        <h1>Redirect</h1>
        <p>Please wait a second...</p>
      </div>
    </div>
  )
}

export default Redirect
