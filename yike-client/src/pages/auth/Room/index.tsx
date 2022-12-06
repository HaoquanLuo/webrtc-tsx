import { useLoadLocalStream } from '@/hooks/useLoadStream'
import React, { useEffect, useState } from 'react'

const Room: React.FC = () => {
  const [roomUsers, setRoomUsers] = useState(1)
  useLoadLocalStream('videos-container')

  const addFakeCamera = () => {
    const container = document.getElementById('videos-container')!
    const camera = document.createElement('div')
    camera.style.width = '100%'
    camera.style.height = '100%'
    camera.style.position = 'relative'
    camera.style.borderRadius = '8px'
    camera.style.color = 'yellow'
    camera.innerHTML =
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi placeat, quasi dolores cum quo magnam officiis nam fugiat fuga quia deleniti provident, assumenda doloribus quibusdam laborum perferendis ducimus enim porro.      Exercitationem assumenda earum natus sint provident et amet similique! Explicabo voluptatem ab, odit distinctio dolores molestiae. Eligendi ullam corporis necessitatibus laboriosam, eveniet accusamus recusandae doloremque iusto non magni voluptatibus officia?'

    container.appendChild(camera)
  }

  useEffect(() => {
    setTimeout(() => {
      setRoomUsers(3)
      for (let i = 0; i < 2; i++) {
        addFakeCamera()
      }
    }, 3000)
  }, [])

  return (
    <div
      id="videos-container"
      className={`relative p-3 w-full h-full gap-3 grid ${
        roomUsers <= 4 ? 'grid-rows-2 grid-cols-2' : 'grid-rows-3 grid-cols-3'
      }`}
    ></div>
  )
}

export default Room
