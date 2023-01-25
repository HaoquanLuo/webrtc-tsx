import { WebRTCHandler } from '@/core/webRTCHandler'
import React, { useState } from 'react'
import IconBox from '../IconBox'
import ScreenPreviewBox from './ScreenPreviewBox'

interface ScreenShareButtonProps {}

const screenConstraints: DisplayMediaStreamOptions = {
  video: true,
  audio: false,
}

const ScreenShareButton: React.FC<ScreenShareButtonProps> = () => {
  const [screenShareStatus, setScreenShareStatus] =
    useState<System.ScreenShare>('camera')
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null)

  const handleScreenShare = async () => {
    setScreenShareStatus(screenShareStatus === 'camera' ? 'screen' : 'camera')
    if (screenShareStatus === 'camera') {
      let stream: MediaStream | null = null

      try {
        stream = await navigator.mediaDevices.getDisplayMedia(screenConstraints)
      } catch (error) {
        console.error(`Failed to get display media: ${error}`)
        setScreenShareStatus('camera')
      }

      if (stream) {
        stream.getTracks()[0].onended = () => {
          setScreenShareStatus('camera')
          WebRTCHandler.handleToggleScreenShare('camera')
        }
        setScreenStream(stream)
        setScreenShareStatus('screen')
        WebRTCHandler.handleToggleScreenShare('screen', stream)
      }
    } else {
      setScreenShareStatus('camera')
      WebRTCHandler.handleToggleScreenShare('camera')
      // 停止共享屏幕
      screenStream?.getTracks()?.forEach((track) => track.stop())
      setScreenStream(null)
    }
  }

  return (
    <>
      <IconBox
        icon={
          <i
            className={
              screenShareStatus === 'camera'
                ? 'i-mdi:camera-flip-outline'
                : 'i-mdi:camera-off'
            }
          />
        }
        handleClick={() => handleScreenShare()}
      />
      {screenShareStatus === 'screen' && screenStream ? (
        <ScreenPreviewBox screenStream={screenStream} />
      ) : null}
    </>
  )
}

export default React.memo(ScreenShareButton)
