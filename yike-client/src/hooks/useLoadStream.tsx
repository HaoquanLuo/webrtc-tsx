import { StreamStatus } from '@/common/typings/stream'
import { useEffect, useRef, useState } from 'react'

/**
 * @description 获取本地媒体流
 */
async function getUserMediaStream() {
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
 * @description 退出房间时清除媒体流（在 useEffect 返回的函数中清除）
 */
function stopBothVideoAndAudio(stream: MediaStream) {
  console.log('run cleanup')
  stream.getTracks().forEach((track) => {
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
  const [streamStatus, setStreamStatus] = useState<StreamStatus>('loading')

  async function getLocalStream() {
    try {
      // 加载本地媒体流
      const localStream = await getUserMediaStream()
      streamRef.current = localStream
      setStreamStatus('complete')
    } catch (error) {
      console.log(`Local MediaStream not available: ${error}`)
    }
  }

  useEffect(() => {
    getLocalStream()

    return () => {
      if (streamRef.current) {
        stopBothVideoAndAudio(streamRef.current)
        streamRef.current = null
        setStreamStatus('loading')
      }
    }
  }, [])

  return {
    localStream: streamRef.current,
    status: streamStatus,
  }
}
