import { useEffect, useRef, useState } from 'react'
import { StreamStatus } from '@/common/typings/stream'
import { getStore } from '@/common/utils/getStore'

/**
 * @description 默认媒体流配置
 */
const defaultConstants: MediaStreamConstraints = {
  audio: true,
  video: {
    width: 640,
    height: 480,
  },
}

/**
 * @description 仅音频流配置
 */
const onlyAudioConstants: MediaStreamConstraints = {
  audio: true,
  video: false,
}

/**
 * @description 获取本地媒体流
 */
export async function getLocalStream() {
  try {
    const constraints = getStore().system.connectWithAudioOnly
      ? onlyAudioConstants
      : defaultConstants
    return await navigator.mediaDevices.getUserMedia(constraints)
  } catch (err: any) {
    throw new Error(err)
  }
}

/**
 * @description 获取远程媒体流
 */
export async function getRemoteStream() {}

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
      // 加载本地媒体流
      const localStream = await streamCallback()
      streamRef.current = localStream
      setStreamStatus('complete')
    } catch (error) {
      console.log(`Local MediaStream not available: ${error}`)
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
