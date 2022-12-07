import React, { useEffect, useRef, VideoHTMLAttributes } from 'react'

type Props = VideoHTMLAttributes<HTMLVideoElement> & {
  srcObject: MediaStream
}

const VideoBox: React.FC<Props> = (props) => {
  const { srcObject } = props
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!videoRef.current) {
      return
    }
    console.log('srcObject', srcObject)
    videoRef.current.srcObject = srcObject
    videoRef.current.addEventListener('click', () => {
      if (videoRef.current!.classList.contains('screen-full')) {
        videoRef.current!.classList.remove('screen-full')
        videoRef.current!.parentElement!.style.position = 'relative'
      } else {
        videoRef.current!.classList.add('screen-full')
        videoRef.current!.parentElement!.style.position = 'static'
      }
    })
  }, [srcObject])

  return (
    <div relative w-full h-full rd-2 mx-a my-0>
      <video
        autoPlay
        ref={videoRef}
        className={`rd-2 absolute block w-full h-full object-cover `}
      />
    </div>
  )
}

export default VideoBox
