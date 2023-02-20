import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { selectConnectWithAudioOnly } from '@/redux/features/system/systemSlice'
import CameraButton from './CameraButton'
import MicButton from './MicButton'
import ScreenShareButton from './ScreenShareButton'

const ActionBox = () => {
  const audioOnlyStatus: boolean = useSelector(selectConnectWithAudioOnly)

  const actionBoxRef = useRef<HTMLDivElement | null>(null)

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    setTimeout(() => {
      if (actionBoxRef.current) {
        actionBoxRef.current.style.opacity = '100'
      }
    })
  }

  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    setTimeout(() => {
      if (actionBoxRef.current) {
        actionBoxRef.current.style.opacity = '0'
      }
    }, 2000)
  }

  useEffect(() => {
    if (actionBoxRef.current) {
      actionBoxRef.current.style.opacity = '100'
    }

    setTimeout(() => {
      if (actionBoxRef.current) {
        actionBoxRef.current.style.opacity = '0'
      }
    }, 2000)
  }, [])

  return (
    <div
      className="
        pointer-events-auto
        absolute
        z-99
        w-full
        h-36
        bottom-2
        left-0
        right-0
      "
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        id="actionBox"
        ref={actionBoxRef}
        w-96
        absolute
        mx-a
        py-2
        px-6
        rd-1
        bg-gray
        bg-op-10
        left-0
        right-0
        bottom-12
        flex
        gap-4
        justify-center
      >
        <MicButton />
        {!audioOnlyStatus && <CameraButton />}
        {!audioOnlyStatus && <ScreenShareButton />}
      </div>
    </div>
  )
}

export default ActionBox
