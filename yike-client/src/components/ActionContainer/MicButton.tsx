import { WebRTCHandler } from '@/core/webRTCHandler'
import React, { useState } from 'react'
import IconContainer from '../IconContainer'
import IconBox from '../IconContainer/IconBox'

interface MicButtonProps {}

const MicButton: React.FC<MicButtonProps> = () => {
  const [micStatus, setMicStatus] = useState<System.Microphone>('loud')

  const handleMicrophone = () => {
    WebRTCHandler.handleToggleMicrophone(micStatus)
    setMicStatus(micStatus === 'loud' ? 'muted' : 'loud')
  }

  return (
    <IconContainer
      Icon={
        <IconBox
          className={
            micStatus === 'loud' ? 'i-mdi-microphone' : 'i-mdi-microphone-off'
          }
        />
      }
      handleClick={() => handleMicrophone()}
    />
  )
}

export default React.memo(MicButton)
