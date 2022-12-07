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
