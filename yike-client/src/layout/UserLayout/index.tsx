import React from 'react'
import { useSelector } from 'react-redux'
import { selectRoomParticipants } from '@/redux/features/system/systemSlice'

const ShadowBox: React.FC<{ children: React.ReactElement }> = (props) => {
  const { children } = props
  return (
    <div p-3 drop-shadow-xl w-full h-full flex>
      <div shadow-xl rd-2 b-op-50 w-full h-full>
        {children}
      </div>
    </div>
  )
}

const UserLayout: React.FC<{ children: React.ReactElement }> = (props) => {
  const { children } = props
  const roomParticipants = useSelector(selectRoomParticipants)

  return (
    <div id="user-layout" flex-1 flex>
      <div min-w="60!" h-a shrink-0>
        {roomParticipants ? (
          roomParticipants.map((user) => {
            return (
              <div key={user.id} className="text-gray">
                username:{user.username}
              </div>
            )
          })
        ) : (
          <p>lorem</p>
        )}
      </div>
      <ShadowBox>{children}</ShadowBox>
    </div>
  )
}

export default UserLayout
