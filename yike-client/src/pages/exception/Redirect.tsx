import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectLogState } from '@/redux/features/system/systemSlice'

const Redirect: React.FC = () => {
  const navigate = useNavigate()
  const logState = useSelector(selectLogState)
  const pathToGo = logState ? '/' : '/login'

  useEffect(() => {
    setTimeout(() => {
      navigate(pathToGo)
    }, 1000)
  }, [])

  return (
    <>
      <h1>Redirect</h1>
      <p>Please wait a second...</p>
    </>
  )
}

export default Redirect
