import React from 'react'
import ShadowBox from '@/components/ShadowBox'
import UserPanel from './UserPanel'
import { useSelector } from 'react-redux'
import { selectRoomStatus } from '@/redux/features/system/systemSlice'

const UserLayout: React.FC<{ children: React.ReactNode }> = (props) => {
  const { children } = props

  const roomStatus = useSelector(selectRoomStatus)

  return (
    <div id="user-layout" flex-1 flex dark="~ text-gray-3">
      <div z--1 fixed w-full h-full>
        <div className="fixed translate-x--40% translate-y--50% w-200 h-200 bg-orange bg-op-90 rounded-100 drop-shadow-[0_0_35px_rgba(251,146,60,0.5)] dark:bg-op-60" />
        <div className="fixed translate-x-240% translate-y-120% w-100 h-100 bg-violet-6 bg-op-90 rounded-100 drop-shadow-[0_0_35px_rgba(124,58,237,0.5)] dark:bg-op-60" />
      </div>
      {(roomStatus === 'created' || roomStatus === 'existed') && <UserPanel />}
      <ShadowBox>{children}</ShadowBox>
    </div>
  )
}

export default React.memo(UserLayout)
