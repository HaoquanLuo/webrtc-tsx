import { useState } from 'react'
import IconBox from './IconBox'
import { WebRTCHandler } from '@/core/webRTCHandler'

const screenConstraints: DisplayMediaStreamOptions = {
  video: true,
  audio: false,
}

const ActionBox = () => {
  const [micStatus, setMicStatus] = useState<System.Microphone>('loud')
  const [cameraStatus, setCameraStatus] = useState<System.Camera>('off')
  const [screenShareStatus, setScreenShareStatus] =
    useState<System.ScreenShare>('camera')
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null)

  const handleMicrophone = () => {
    WebRTCHandler.handleToggleMicrophone(micStatus)
    setMicStatus(micStatus === 'loud' ? 'muted' : 'loud')
  }
  const handleCamera = () => {
    debugger
    WebRTCHandler.handleToggleCamera(cameraStatus)
    setCameraStatus(cameraStatus === 'off' ? 'on' : 'off')
  }

  const handleScreenShare = async () => {
    setScreenShareStatus(screenShareStatus === 'screen' ? 'camera' : 'screen')
    if (screenShareStatus === 'camera') {
      let stream: MediaStream | null = null

      try {
        stream = await navigator.mediaDevices.getDisplayMedia(screenConstraints)
      } catch (error) {
        console.error(`Failed to get display media.`)
      }

      if (stream) {
        WebRTCHandler.handleToggleScreenShare(screenShareStatus, stream)
        setScreenStream(stream)
        setScreenShareStatus('screen')
      }
    } else {
      WebRTCHandler.handleToggleScreenShare(screenShareStatus)
      setScreenShareStatus('camera')
      // 停止共享屏幕
      screenStream?.getTracks()?.forEach((track) => track.stop())
      setScreenStream(null)
    }
  }

  return (
    <div
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
        w-64
        absolute
        mx-a
        py-2
        px-6
        rd-1
        bg-gray
        bg-op-40
        left-0
        right-0
        bottom-12
        flex
        gap-4
        justify-center
      >
        <IconBox
          icon={
            <i
              className={
                micStatus === 'loud'
                  ? 'i-mdi-microphone'
                  : 'i-mdi-microphone-off'
              }
            />
          }
          handleClick={() => handleMicrophone()}
        />
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
        <IconBox
          icon={<i className={'i-mdi:camera-flip-outline'} />}
          handleClick={() => handleScreenShare()}
        />
      </div>
    </div>
  )
}

export default ActionBox
