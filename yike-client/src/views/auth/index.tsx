import React from 'react'
import '@/App.css'
import { Outlet } from 'react-router-dom'

const AuthPage: React.FC = () => {
  return (
    <>
      <h1>Auth Page</h1>
      <Outlet />
    </>
  )
}

export default AuthPage
