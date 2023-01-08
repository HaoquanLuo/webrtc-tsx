import { stopBothVideoAndAudio } from '@/common/utils/helpers/stopBothVideoAndAudio'
import React, { useEffect, useRef, useState, VideoHTMLAttributes } from 'react'
import LoadingBox from './LoadingBox'

type Props = VideoHTMLAttributes<HTMLVideoElement> & {
  audioOnly?: boolean
  srcObject: MediaStream
  userName?: string
}

const MediaBox: React.FC<Props> = (props) => {
  const { audioOnly, srcObject, userName } = props
  const videoRef = useRef<HTMLVideoElement>(null)
  const [readyState, setReadyState] = useState<boolean>(false)

  useEffect(() => {
    if (videoRef.current === null) {
      throw new Error(`'videoRef.current' is null`)
    }

    if (srcObject !== null) {
      if (videoRef.current === null) {
        throw new Error(`'videoRef.current' is null`)
      }

      if (videoRef.current.parentElement === null) {
        throw new Error(`'videoRef.current.parentElement' is null`)
      }

      videoRef.current.srcObject = srcObject
      videoRef.current.addEventListener('click', () => {
        if (videoRef.current === null) {
          throw new Error(`'videoRef.current' is null`)
        }

        if (videoRef.current.parentElement === null) {
          throw new Error(`'videoRef.current.parentElement' is null`)
        }

        if (videoRef.current.classList.contains('screen-full')) {
          videoRef.current.classList.remove('screen-full')
          videoRef.current.parentElement.style.position = 'relative'
        } else {
          videoRef.current.classList.add('screen-full')
          videoRef.current.parentElement.style.position = 'static'
        }
      })
      setReadyState(true)
    }

    return () => {
      console.log('Run cleanup')

      stopBothVideoAndAudio(srcObject)
      setReadyState(false)
    }
  }, [srcObject])

  return (
    <div relative w-full h-full rd-2 mx-a my-0>
      {audioOnly && (
        <div
          pointer-events-auto
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
                {userName}
              </span>
              <span>仅以音频连接</span>
            </div>
          </div>
        </div>
      )}
      {!readyState && <LoadingBox absolute />}
      <video
        autoPlay
        ref={videoRef}
        className={`rd-2 absolute block w-full h-full object-cover`}
      />
    </div>
  )
}

export default React.memo(MediaBox)
