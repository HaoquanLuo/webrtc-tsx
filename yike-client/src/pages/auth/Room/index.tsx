import React from 'react'
import { getLocalStream } from '@/hooks/useLoadStream'
import { selectUserInfo } from '@/redux/features/user/userSlice'
import { useSelector } from 'react-redux'
import {
  selectConnectWithAudioOnly,
  selectRoomParticipants,
} from '@/redux/features/system/systemSlice'
import CameraBox from '@/components/CameraBox'

const Room: React.FC = () => {
  const { username } = useSelector(selectUserInfo)
  const connectWithAudioOnly = useSelector(selectConnectWithAudioOnly)
  const roomParticipants = useSelector(selectRoomParticipants)

  return (
    <div
      id="videos-container"
      className={`relative p-1 w-full h-full gap-3 grid ${
        roomParticipants.length <= 4
          ? 'grid-rows-2 grid-cols-2'
          : 'grid-rows-3 grid-cols-3'
      }`}
    >
      <CameraBox
        withAudioOnly={connectWithAudioOnly}
        getStreamFunction={getLocalStream}
        username={username}
      />
    </div>
  )
}

export default Room
