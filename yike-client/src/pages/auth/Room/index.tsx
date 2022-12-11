import React, { useState } from 'react'
import LoadingBox from '@/components/LoadingBox'
import MediaBox from '@/components/MediaBox'
import { getLocalStream, useLoadStream } from '@/hooks/useLoadStream'
import { selectUserInfo } from '@/redux/features/user/userSlice'
import { useSelector } from 'react-redux'
import {
  selectConnectOnlyWithAudio,
  selectRoomParticipants,
} from '@/redux/features/system/systemSlice'

const Room: React.FC = () => {
  const { username } = useSelector(selectUserInfo)
  const isAudioOnly = useSelector(selectConnectOnlyWithAudio)
  const roomParticipants = useSelector(selectRoomParticipants)

  const FakeCamera = () => {
    return (
      <div grid place-items-center>
        <div w-full h-full relative rd-2 text-yellow>
          Fake Camera
        </div>
      </div>
    )
  }

  const LocalCamera = () => {
    const { localStream, streamStatus } = useLoadStream(getLocalStream)

    return (
      <div grid place-items-center>
        {streamStatus === 'loading' && <LoadingBox />}
        {streamStatus === 'complete' && (
          <MediaBox audioOnly={isAudioOnly} srcObject={localStream!} />
        )}
      </div>
    )
  }

  return (
    <div
      id="videos-container"
      className={`relative p-1 w-full h-full gap-3 grid ${
        roomParticipants.length <= 4
          ? 'grid-rows-2 grid-cols-2'
          : 'grid-rows-3 grid-cols-3'
      }`}
    >
      <LocalCamera />
    </div>
  )
}

export default Room
