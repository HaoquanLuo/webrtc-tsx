import { StreamStatus } from '@/common/typings/stream'
import VideoBox from '@/components/VideoBox'
import React, { useEffect, useRef, useState } from 'react'
import { useSocket } from './useSocket'

/**
 * @description 获取本地媒体流
 */
export async function getUserMediaStream() {
  try {
    const constraints = {
      audio: true,
      video: true,
    }
    return await navigator.mediaDevices.getUserMedia(constraints)
  } catch (err: any) {
    throw new Error(err)
  }
}

/**
 * @description 将传入的媒体流添加到到目标元素中
 */
// export async function addCamera2Target(
//   idAppendTo: string,
//   stream: MediaStream,
// ) {
//   const parentContainer = document.getElementById(`${idAppendTo}`)!
//   const videoElement: HTMLVideoElement = document.createElement('video')
//   const videoContainer: HTMLDivElement = document.createElement('div')
//   try {
//     // videoContainer.style
//     videoContainer.style.position = 'relative'
//     videoContainer.style.width = '100%'
//     videoContainer.style.height = '100%'
//     videoContainer.style.borderRadius = '8px'
//     videoContainer.style.margin = '0 auto'
//     parentContainer.appendChild(videoContainer)

//     // videoElement
//     videoElement.srcObject = stream
//     videoElement.autoplay = true
//     // videoElement.controls = true

//     // onloadedmetadata在指定视频/音频的元数据加载后触发。
//     videoElement.onloadedmetadata = () => {
//       videoElement.play()
//     }

//     // videoElement.style
//     videoElement.style.position = 'absolute'
//     videoElement.style.display = 'block'
//     videoElement.style.width = '100%'
//     videoElement.style.height = '100%'
//     videoElement.style.objectFit = 'cover'
//     // absolute 布局下的居中
//     videoElement.style.margin = '0 auto'
//     videoElement.style.borderRadius = '8px'

//     // 放大/缩小视频信息
//     videoElement.addEventListener('click', () => {
//       if (videoElement.classList.contains('screen-full')) {
//         videoElement.classList.remove('screen-full')
//         videoElement.parentElement!.style.position = 'relative'
//       } else {
//         videoElement.classList.add('screen-full')
//         videoElement.parentElement!.style.position = 'static'
//       }
//     })

//     videoContainer.appendChild(videoElement)
//   } catch (error) {
//     console.log(error)
//   }
// }

/**
 * @description 退出房间时清除媒体流（在 useEffect 返回的函数中清除）
 */
export function stopBothVideoAndAudio(stream: MediaStream) {
  stream.getTracks().forEach((track) => {
    console.log('track: ', track)
    if (track.readyState === 'live') {
      track.stop()
    }
  })
}

/**
 * @description 进入房间后加载本地媒体流
 * @returns `localStream`: 本地媒体流 , `status`: 媒体流状态
 */
export const useLocalStream = () => {
  const streamRef = useRef<MediaStream | null>(null)
  const [status, setStatus] = useState<StreamStatus>('loading')

  useEffect(() => {
    const getLocalStream = async () => {
      try {
        // 加载本地媒体流
        const localStream = await getUserMediaStream()
        streamRef.current = localStream
        setStatus('complete')
      } catch (error) {
        console.log(`Local MediaStream not available`)
      }
    }
    getLocalStream()
    return () => {
      console.log('run cleanup')
      setStatus('loading')
      if (streamRef.current) {
        stopBothVideoAndAudio(streamRef.current)
      }
    }
  }, [])

  return {
    localStream: streamRef.current,
    status,
  }
}
