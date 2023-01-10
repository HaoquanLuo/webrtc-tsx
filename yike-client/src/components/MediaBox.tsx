import React, { useEffect, useRef, VideoHTMLAttributes } from 'react'

type Props = VideoHTMLAttributes<HTMLVideoElement> & {
  audioOnly?: boolean
  srcObject: MediaStream
  userName?: string
}

const MediaBox: React.FC<Props> = (props) => {
  const { audioOnly, srcObject, userName } = props
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleAddFullScreen = (element: HTMLElement) => {
    return () => {
      if (element === null) {
        throw new Error(`'element' is null`)
      }

      if (element.parentElement === null) {
        throw new Error(`'element.parentElement' is null`)
      }

      if (element.classList.contains('screen-full')) {
        element.classList.remove('screen-full')
        element.parentElement.style.position = 'relative'
      } else {
        element.classList.add('screen-full')
        element.parentElement.style.position = 'static'
      }
    }
  }

  useEffect(() => {
    if (videoRef.current === null) {
      throw new Error(`'videoRef.current' is null`)
    }

    videoRef.current.srcObject = srcObject
    videoRef.current.addEventListener

    videoRef.current.addEventListener(
      'click',
      handleAddFullScreen(videoRef.current),
    )

    return () => {
      videoRef.current?.removeEventListener(
        'click',
        handleAddFullScreen(videoRef.current),
      )
    }
  }, [srcObject])

  return (
    <div relative w-full h-full rd-2 mx-a my-0 b-gray b-1 b-op-50>
      {audioOnly && (
        <div
          pointer-events-auto
          absolute
          w-full
          h-full
          z-9
          rd-2
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
      <video
        autoPlay
        ref={videoRef}
        className={`rd-2 absolute block w-full h-full object-cover`}
      />
    </div>
  )
}

export default React.memo(MediaBox)
