import { useEffect, useRef } from 'react'
import { stopBothVideoAndAudio } from '../MediaBox'

interface ScreenPreviewBoxProps {
  screenStream: MediaStream
}

const ScreenPreviewBox: React.FC<ScreenPreviewBoxProps> = ({
  screenStream,
}) => {
  const previewRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!previewRef.current) {
      throw new Error(`Could not get screen flow`)
    }

    previewRef.current.srcObject = screenStream

    return () => {
      if (previewRef.current?.srcObject) {
        console.log('run screen cleanup')

        stopBothVideoAndAudio(screenStream)
        previewRef.current.srcObject = null
      }
    }
  }, [screenStream])

  return (
    <div absolute rd-2 top-0 bottom-0 left-0 right-0 px-2>
      <video width={'auto'} height={'90%'} ref={previewRef} muted autoPlay />
    </div>
  )
}

export default ScreenPreviewBox
