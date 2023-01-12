import React from 'react'
import { useSelector } from 'react-redux'
import { selectConnectWithAudioOnly } from '@/redux/features/system/systemSlice'
import CameraButton from './ActionButtons/CameraButton'
import MicButton from './ActionButtons/MicButton'
import ScreenShareButton from './ActionButtons/ScreenShareButton'

const ActionBox = () => {
  const audioOnlyStatus: boolean = useSelector(selectConnectWithAudioOnly)

  return (
    <div
      z-99
      absolute
      w-full
      h-36
      op-0
      hover:op-100
      transition-1000
      bottom-0
      left-0
      right-0
      pointer-events-auto
    >
      <div
        w-96
        absolute
        mx-a
        py-2
        px-6
        rd-1
        bg-gray
        bg-op-20
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
