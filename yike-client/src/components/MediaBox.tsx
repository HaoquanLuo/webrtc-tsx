import { stopBothVideoAndAudio } from '@/common/utils/stopBothVideoAndAudio'
import React, { useEffect, useRef, VideoHTMLAttributes } from 'react'

type Props = VideoHTMLAttributes<HTMLVideoElement> & {
  audioOnly: boolean
  srcObject: MediaStream
  username: string
}

const MediaBox: React.FC<Props> = (props) => {
  const { audioOnly, srcObject, username } = props
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!videoRef.current) {
      return
    }

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

    return () => {
      if (srcObject) {
        console.log('run cleanup', srcObject)

        stopBothVideoAndAudio(srcObject)
      }
    }
  }, [videoRef.current, srcObject])

  return (
    <div relative w-full h-full rd-2 mx-a my-0>
      {audioOnly && (
        <div
          absolute
          w-full
          h-full
          z-9
          rd-2
          b-gray
          b-2
          b-op-50
          bg-gray
          bg-op-40
        >
          <div grid place-items-center w-full h-full text-xl>
            <div>
              <span>用户</span>
              <span font-600 mx-1 font-italic>
                {username}
              </span>
              <span>仅以音频连接</span>
            </div>
          </div>
        </div>
      )}
      <video
        controls
        muted
        autoPlay
        ref={videoRef}
        className={`rd-2 absolute block w-full h-full object-cover`}
      />
    </div>
  )
}

export default MediaBox
