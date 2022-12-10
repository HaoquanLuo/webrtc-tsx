import React, { useState } from 'react'
import LoadingBox from '@/components/LoadingBox'
import VideoBox from '@/components/VideoBox'
import { useLocalStream } from '@/hooks/useLoadStream'

const Room: React.FC = () => {
  const [roomUsers, setRoomUsers] = useState(1)

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
    const { localStream, streamStatus } = useLocalStream()

    return (
      <div grid place-items-center>
        {streamStatus === 'loading' && <LoadingBox />}
        {streamStatus === 'complete' && <VideoBox srcObject={localStream!} />}
      </div>
    )
  }

  return (
    <div
      id="videos-container"
      className={`relative p-1 w-full h-full gap-3 grid ${
        roomUsers <= 4 ? 'grid-rows-2 grid-cols-2' : 'grid-rows-3 grid-cols-3'
      }`}
    >
      <LocalCamera />
    </div>
  )
}

export default Room
