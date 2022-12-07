import VideoBox from '@/components/VideoBox'
import { useLocalStream } from '@/hooks/useLoadStream'
import React, { useState } from 'react'

const Room: React.FC = () => {
  const [roomUsers, setRoomUsers] = useState(1)

  const addFakeCamera = () => {
    const container = document.getElementById('videos-container')!
    const camera = document.createElement('div')
    camera.style.width = '100%'
    camera.style.height = '100%'
    camera.style.position = 'relative'
    camera.style.borderRadius = '8px'
    camera.style.color = 'yellow'
    camera.innerHTML = 'Fake Camera Here'

    container.appendChild(camera)
  }

  const LocalCamera = () => {
    const { localStream, status } = useLocalStream()

    return (
      <div grid place-items-center>
        {status === 'loading' && (
          <div text-center animate-spin i-mdi-loading text-9xl></div>
        )}
        {status === 'complete' && <VideoBox srcObject={localStream!} />}
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
