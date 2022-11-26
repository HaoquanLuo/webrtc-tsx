import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectLogState } from '@/features/system/systemSlice'

const Redirect: React.FC = () => {
  const navigate = useNavigate()
  const logState = useSelector(selectLogState)
  const pathToGo = logState ? '/' : '/login'
  setTimeout(() => {
    navigate(pathToGo)
  }, 1000)
  return (
    <>
      <h1>Redirect</h1>
      <p>Please wait a second...</p>
      <div className="animate-spin circle"></div>
    </>
  )
}

export default Redirect
