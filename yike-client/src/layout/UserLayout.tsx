import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectRoomParticipants } from '@/redux/features/system/systemSlice'
import ShadowBox from '@/components/ShadowBox'

const UserLayout: React.FC<{ children: React.ReactElement }> = (props) => {
  const { children } = props
  const roomParticipants = useSelector(selectRoomParticipants)

  useEffect(() => {
    console.log(roomParticipants)
  }, [roomParticipants])

  return (
    <div id="user-layout" flex-1 flex>
      <div w-60 h-a shrink-0>
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
