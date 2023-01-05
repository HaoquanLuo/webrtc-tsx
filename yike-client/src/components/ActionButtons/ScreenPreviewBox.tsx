import { useEffect, useRef } from 'react'

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
  }, [screenStream])

  return (
    <div absolute rd-2 top-0 bottom-0 left-0 right-0>
      <video width={'auto'} height={'100%'} ref={previewRef} muted autoPlay />
    </div>
  )
}

export default ScreenPreviewBox
