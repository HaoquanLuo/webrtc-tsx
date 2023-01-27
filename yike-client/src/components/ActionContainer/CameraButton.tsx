import React, { useState } from 'react'
import IconContainer from '../IconContainer'
import { WebRTCHandler } from '@/core/webRTCHandler'
import IconBox from '../IconContainer/IconBox'

interface CameraButtonProps {}

const CameraButton: React.FC<CameraButtonProps> = () => {
  const [cameraStatus, setCameraStatus] = useState<System.Camera>('off')

  const handleCamera = () => {
    WebRTCHandler.handleToggleCamera(cameraStatus)
    setCameraStatus(cameraStatus === 'off' ? 'on' : 'off')
  }

  return (
    <IconContainer
      Icon={
        <IconBox
          className={
            cameraStatus === 'off'
              ? 'i-mdi:camera-off-outline'
              : 'i-mdi:camera-outline'
          }
        />
      }
      handleClick={() => handleCamera()}
    />
  )
}

export default React.memo(CameraButton)
