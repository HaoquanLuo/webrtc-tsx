import SimplePeer from 'simple-peer'
import { WebRTC } from '@/common/typings/webRTC'
import * as SocketClient from './SocketClient'
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
export async function getRemoteStream() {
  return streamWithIds
}

/**
 * @description 房间内其他用户的 peer 对象
 */
let peers: {
  [key: string]: SimplePeer.Instance
} = {}

/**
 * @description 房间内其他用户的媒体流
 */
let streamWithIds: WebRTC.StreamWithId[] = []

/**
 * @description Peer 配置信息
 * @returns
 */
const getConfiguration = () => {
  return {
    iceServers: [
      {
        urls: 'stun:stun1.l.google.com:19302',
      },
    ],
  }
}

/**
 * @description 本地媒体流
 */
let localStream: MediaStream

/**
 * @description 准备对等对象连接逻辑
 * @param toConnectSocketId
 * @param isInitiator
 */
export function prepareNewPeerConnection(
  toConnectSocketId: string,
  isInitiator: boolean,
) {
  ;(async () => {
    if (localStream !== undefined) {
      return
    }
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

    SocketClient.sendSignalData(signalData)
  })

  // 获取媒体流 stream
  peers[toConnectSocketId].on('stream', (stream) => {
    console.log('成功获取远程 stream')

    addStream(stream, toConnectSocketId)
  })
}

/**
 * @description 发送信令数据到对等连接中
 * @param data
 */
export function handleSignalingData(data: WebRTC.DataSignal) {
  const { toConnectSocketId, signal } = data

  // 处理错误情况
  if (toConnectSocketId === undefined) {
    throw new Error(`SignalData error: toConnectSocketId not defined`)
  }
  if (signal === undefined) {
    throw new Error(`SignalData error: signal not defined`)
  }

  // 将信令数据添加到对等连接中
  peers[toConnectSocketId].signal(signal)
}

export function addStream(stream: MediaStream, toConnectSocketId: string) {
  const newStreamWithId: WebRTC.StreamWithId = {
    stream,
    toConnectId: toConnectSocketId,
  }

  streamWithIds = [...streamWithIds, newStreamWithId]
}
