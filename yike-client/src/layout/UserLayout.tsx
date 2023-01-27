import React from 'react'
import ShadowBox from '@/components/ShadowBox'
import UserPanel from './UserPanel'
import { useSelector } from 'react-redux'
import { selectRoomStatus } from '@/redux/features/system/systemSlice'

const UserLayout: React.FC<{ children: React.ReactElement }> = (props) => {
  const { children } = props

  const roomStatus = useSelector(selectRoomStatus)

  return (
    <div id="user-layout" flex-1 flex dark="~ text-gray-3">
      {(roomStatus === 'created' || roomStatus === 'existed') && <UserPanel />}
      <ShadowBox>{children}</ShadowBox>
    </div>
  )
}

export default React.memo(UserLayout)
