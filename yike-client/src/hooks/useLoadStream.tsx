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
      if (WebRTCHandler.localStream === null) {
        const localStream = await streamCallback()
        streamRef.current = localStream
      } else {
        streamRef.current = WebRTCHandler.localStream
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
