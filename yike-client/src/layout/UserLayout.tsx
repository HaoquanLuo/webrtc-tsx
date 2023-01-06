import React from 'react'
import { useSelector } from 'react-redux'
import { selectRoomParticipants } from '@/redux/features/system/systemSlice'
import ShadowBox from '@/components/ShadowBox'

const UserLayout: React.FC<{ children: React.ReactElement }> = (props) => {
  const { children } = props
  const roomParticipants = useSelector(selectRoomParticipants)

  return (
    <div id="user-layout" flex-1 flex>
      <div w-60 h-a shrink-0 px-2>
        {roomParticipants
          ? roomParticipants.map((user) => {
              return (
                <div
                  key={user.id}
                  className="text-gray py-1 even:b-t hover:bg-op-20 hover:bg-gray hover:rd-2"
                >
                  <div font-bold>{user.username}</div>
                  <div>{user.socketId}</div>
                </div>
              )
            })
          : null}
      </div>
      <ShadowBox>{children}</ShadowBox>
    </div>
  )
}

export default UserLayout
