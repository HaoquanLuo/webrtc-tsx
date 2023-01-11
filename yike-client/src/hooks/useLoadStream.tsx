import { useEffect, useRef, useState } from 'react'
import { StreamStatus } from '@/common/typings/stream'
import { WebRTCHandler } from '@/core/webRTCHandler'

/**
 * @description 进入房间后加载媒体流
 * @returns `stream`: 媒体流 , `status`: 媒体流状态
 */
export const useLoadStream = (streamCallback: () => Promise<MediaStream>) => {
  const streamRef = useRef<MediaStream | null>(null)
  const [streamStatus, setStreamStatus] = useState<StreamStatus>('loading')

  async function getStream() {
    try {
      const localStream = WebRTCHandler.getLocalStream()
      if (localStream === null) {
        const stream = await streamCallback()
        WebRTCHandler.setLocalStream(stream)
        streamRef.current = stream
      } else {
        streamRef.current = localStream
      }
      setStreamStatus('completed')
    } catch (error) {
      throw new Error(`Local MediaStream not available: ${error}`)
    }
  }

  useEffect(() => {
    getStream()

    return () => {
      if (streamRef.current) {
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
