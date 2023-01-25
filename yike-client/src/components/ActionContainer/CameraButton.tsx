import React, { useState } from 'react'
import IconBox from '../IconBox'
import { WebRTCHandler } from '@/core/webRTCHandler'

interface CameraButtonProps {}

const CameraButton: React.FC<CameraButtonProps> = () => {
  const [cameraStatus, setCameraStatus] = useState<System.Camera>('off')

  const handleCamera = () => {
    WebRTCHandler.handleToggleCamera(cameraStatus)
    setCameraStatus(cameraStatus === 'off' ? 'on' : 'off')
  }

  return (
    <IconBox
      icon={
        <i
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
