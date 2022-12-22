import UserLayout from '@/layout/UserLayout'
import React from 'react'
import { Outlet } from 'react-router-dom'

const CommonPage: React.FC = () => {
  return (
    <UserLayout>
      <Outlet />
    </UserLayout>
  )
}

export default CommonPage
