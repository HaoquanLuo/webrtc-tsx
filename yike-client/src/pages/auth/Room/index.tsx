import React, { useEffect, useState } from 'react'
import LoadingBox from '@/components/LoadingBox'
import VideoBox from '@/components/VideoBox'
import { useLocalStream } from '@/hooks/useLoadStream'
import { useSocket } from '@/hooks/useSocket'

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
    const { localStream, status } = useLocalStream()

    return (
      <div grid place-items-center>
        {status === 'loading' && <LoadingBox />}
        {status === 'complete' && <VideoBox srcObject={localStream!} />}
      </div>
    )
  }

  // useEffect(() => {
  //   let timer = setTimeout(() => {
  //     setRoomUsers(3)
  //   }, 1000)

  //   return () => {
  //     clearTimeout(timer)
  //   }
  // }, [])

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
