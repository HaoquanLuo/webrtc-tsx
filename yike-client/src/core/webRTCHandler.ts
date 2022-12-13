import SimplePeer from 'simple-peer'
import { WebRTC } from '@/common/typings/webRTC'
import { getLocalStream } from '@/hooks/useLoadStream'
import { sendSignalData } from './SocketClient'

let peers: {
  [key: string]: SimplePeer.Instance
} = {}
let streams: MediaStream[] = []

const getConfiguration = () => {
  return {
    iceServers: [
      {
        urls: 'stun:stun1.l.google.com:19302',
      },
    ],
  }
}

let localStream: MediaStream

export function prepareNewPeerConnection(
  toConnectSocketId: string,
  isInitiator: boolean,
) {
  ;(async () => {
    localStream = await getLocalStream()
  })()

  const configuration = getConfiguration()

  // 实例化对等连接对象
  peers[toConnectSocketId] = new SimplePeer({
    initiator: isInitiator,
    config: configuration,
    stream: localStream,
  })

  // 信令数据传输
  peers[toConnectSocketId].on('signal', (data) => {
    const signalData = {
      signal: data,
      toConnectSocketId,
    }
    sendSignalData(signalData)
  })

  // 获取媒体流 stream
  peers[toConnectSocketId].on('stream', (stream) => {
    console.log('成功获取远程 stream')
    /**
     * @todo 完成添加远程 stream 的逻辑
     */
    // addStream(stream, toConnectSocketId)
  })
}

export function handleSignalingData(data: WebRTC.DataSignal) {
  const { toConnectSocketId, signal } = data

  // 处理错误情况
  if (!toConnectSocketId) {
    return new Error(`SignalData error: toConnectSocketId not defined`)
  }
  if (!signal) {
    return new Error(`SignalData error: signal not defined`)
  }

  // 将信令数据添加到对等连接中
  peers[toConnectSocketId].signal(signal)
}
