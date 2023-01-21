import { WebRTCHandler } from '@/core/webRTCHandler'
import { useState } from 'react'
import IconBox from '../IconBox'

interface MicButtonProps {}

const MicButton: React.FC<MicButtonProps> = () => {
  const [micStatus, setMicStatus] = useState<System.Microphone>('loud')

  const handleMicrophone = () => {
    WebRTCHandler.handleToggleMicrophone(micStatus)
    setMicStatus(micStatus === 'loud' ? 'muted' : 'loud')
  }

  return (
    <IconBox
      icon={
        <i
          className={
            micStatus === 'loud' ? 'i-mdi-microphone' : 'i-mdi-microphone-off'
          }
        />
      }
      handleClick={() => handleMicrophone()}
    />
  )
}

export default MicButton
