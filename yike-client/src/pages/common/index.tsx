import UserLayout from '@/layout/UserLayout'
import { selectLogState } from '@/redux/features/user/userSlice'
import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import Login from './Login'

const CommonPage: React.FC = () => {
  const logState = useSelector(selectLogState)

  return (
    <UserLayout>
      <Outlet />
      {!logState && <Login />}
    </UserLayout>
  )
}

export default CommonPage
