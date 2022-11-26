import React from 'react'
import { Outlet } from 'react-router-dom'

import '@/App.css'

const CommonPage: React.FC = () => {
  return (
    <>
      <h1>Common Page</h1>
      <Outlet />
    </>
  )
}

export default CommonPage
