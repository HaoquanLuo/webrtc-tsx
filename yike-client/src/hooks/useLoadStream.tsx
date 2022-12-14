import { useEffect, useRef, useState } from 'react'
import { StreamStatus } from '@/common/typings/stream'

/**
 * @description 退出房间时清除媒体流
 */
function stopBothVideoAndAudio(stream: MediaStream) {
  stream.getTracks().forEach((track) => {
    if (track.readyState === 'live') {
      track.stop()
    }
  })
}

/**
 * @description 进入房间后加载媒体流
 * @returns `stream`: 媒体流 , `status`: 媒体流状态
 */
export const useLoadStream = (streamCallback: () => Promise<MediaStream>) => {
  const streamRef = useRef<MediaStream | null>(null)
  const [streamStatus, setStreamStatus] = useState<StreamStatus>('loading')

  async function getStream() {
    try {
      const localStream = await streamCallback()
      streamRef.current = localStream
      setStreamStatus('complete')
    } catch (error) {
      throw new Error(`Local MediaStream not available: ${error}`)
    }
  }

  useEffect(() => {
    getStream()

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
    streamStatus,
  }
}
