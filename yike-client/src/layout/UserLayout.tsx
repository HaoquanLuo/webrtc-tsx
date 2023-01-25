import React from 'react'
import ShadowBox from '@/components/ShadowBox'
import UserPanel from './UserPanel'

const UserLayout: React.FC<{ children: React.ReactElement }> = (props) => {
  const { children } = props

  return (
    <div id="user-layout" flex-1 flex>
      <UserPanel />
      <ShadowBox>{children}</ShadowBox>
    </div>
  )
}

export default React.memo(UserLayout)
