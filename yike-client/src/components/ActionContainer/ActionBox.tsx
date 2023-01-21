import React from 'react'
import { useSelector } from 'react-redux'
import { selectConnectWithAudioOnly } from '@/redux/features/system/systemSlice'
import CameraButton from './CameraButton'
import MicButton from './MicButton'
import ScreenShareButton from './ScreenShareButton'

const ActionBox = () => {
  const audioOnlyStatus: boolean = useSelector(selectConnectWithAudioOnly)

  return (
    <div
      pointer-events-auto
      absolute
      z-99
      w-full
      h-36
      op-0
      transition-600
      bottom-0
      left-0
      right-0
      hover:op-100
    >
      <div
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

export default React.memo(ActionBox)
