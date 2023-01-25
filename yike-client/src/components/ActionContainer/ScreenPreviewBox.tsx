import React, { useEffect, useRef, useState } from 'react'
import { stopBothVideoAndAudio } from '@/common/utils/helpers/stopBothVideoAndAudio'

interface ScreenPreviewBoxProps {
  screenStream: MediaStream
}

const ScreenPreviewBox: React.FC<ScreenPreviewBoxProps> = ({
  screenStream,
}) => {
  const previewRef = useRef<HTMLVideoElement>(null)
  const [readyState, setReadyState] = useState(false)

  useEffect(() => {
    if (!previewRef.current) {
      throw new Error(`Could not get screen flow`)
    }

    previewRef.current.srcObject = screenStream
    setReadyState(true)

    return () => {
      if (readyState) {
        console.log('Run screen cleanup')

        stopBothVideoAndAudio(screenStream)
      }
    }
  }, [screenStream])

  return (
    <div
      pointer-events-none
      w-a
      absolute
      rd-2
      top-0
      bottom-0
      left-0
      right-0
      px-2
    >
      <video width={'auto'} height={'100%'} ref={previewRef} muted autoPlay />
    </div>
  )
}

export default React.memo(ScreenPreviewBox)
