import SimplePeer from 'simple-peer'
import { WebRTC } from '@/common/typings/webRTC'
import * as SocketClient from './SocketClient'
import { getStore } from '@/common/utils/getStore'
import { store } from '@/redux/store'
import { setWebRTCStatus } from '@/redux/features/system/systemSlice'

const dispatch = store.dispatch

export class WebRTCHandler {
  /**
   * @description 本地媒体流
   */
  static localStream: MediaStream

  /**
   * @description 房间内其他用户的 peer 对象
   */
  static peers: {
    [key: string]: SimplePeer.Instance
  } = {}

  /**
   * @description 房间内其他用户的媒体流
   */
  static streamWithIds: WebRTC.StreamWithId[] = []

  /**
   * @description 默认媒体流配置
   */
  static defaultConstants: MediaStreamConstraints = {
    audio: true,
    video: {
      width: 640,
      height: 480,
    },
  }

  /**
   * @description 仅音频流配置
   */
  static onlyAudioConstants: MediaStreamConstraints = {
    audio: true,
    video: false,
  }

  /**
   * @description Peer 配置信息
   * @returns
   */
  static getConfiguration() {
    return {
      iceServers: [
        {
          urls: 'stun:stun1.l.google.com:19302',
        },
      ],
    }
  }

  /**
   * @description 获取本地媒体流
   */
  public static async getLocalStream() {
    try {
      const isAudioOnly = getStore().system.connectWithAudioOnly
      const constraints = isAudioOnly
        ? WebRTCHandler.onlyAudioConstants
        : WebRTCHandler.defaultConstants
      return await navigator.mediaDevices.getUserMedia(constraints)
    } catch (err: any) {
      throw new Error(err)
    }
  }

  /**
   * @description 获取远程媒体流
   */
  public static getRemoteStream() {
    return WebRTCHandler.streamWithIds
  }

  /**
   * @description 准备对等对象连接逻辑
   * @param connSocketId
   * @param isInitiator
   */
  public static async handlePeerConnection(
    connSocketId: string,
    isInitiator: boolean,
  ) {
    WebRTCHandler.localStream = await WebRTCHandler.getLocalStream()

    const configuration = WebRTCHandler.getConfiguration()

    // 实例化对等连接对象
    WebRTCHandler.peers[connSocketId] = new SimplePeer({
      initiator: isInitiator,
      config: configuration,
      stream: WebRTCHandler.localStream,
    })

    // 信令数据传输
    WebRTCHandler.peers[connSocketId].on('signal', (data) => {
      const signalData = {
        signal: data,
        connUserSocketId: connSocketId,
      }

      SocketClient.sendSignalData(signalData)
    })

    // 获取媒体流 stream
    WebRTCHandler.peers[connSocketId].on('stream', (stream) => {
      WebRTCHandler.addStream(stream, connSocketId)

      dispatch(setWebRTCStatus('initializing'))
    })

    WebRTCHandler.peers[connSocketId].on('error', (err) => {
      console.error(err)
    })

    WebRTCHandler.peers[connSocketId].on('connect', () => {
      WebRTCHandler.peers[connSocketId].send('whatever' + Math.random())

      dispatch(setWebRTCStatus('connected'))
    })

    WebRTCHandler.peers[connSocketId].on('data', (data) => {
      console.log('data: ' + data)
    })

    WebRTCHandler.peers[connSocketId].on('close', () => {
      delete WebRTCHandler.peers[connSocketId]

      dispatch(setWebRTCStatus('disconnected'))
    })
  }

  /**
   * @description 发送信令数据到对等连接中
   * @param data
   */
  public static handleSignalingData(data: WebRTC.DataSignal) {
    const { connUserSocketId, signal } = data

    // 处理错误情况
    if (connUserSocketId === undefined) {
      throw new Error(`SignalData error: toConnectSocketId not defined`)
    }
    if (signal === undefined) {
      throw new Error(`SignalData error: signal not defined`)
    }

    // 将信令数据添加到对等连接中
    WebRTCHandler.peers[connUserSocketId].signal(signal)
  }

  /**
   * @description 添加远程媒体流到本地
   * @param stream
   * @param toConnectSocketId
   */
  public static addStream(stream: MediaStream, toConnectSocketId: string) {
    const newStreamWithId: WebRTC.StreamWithId = {
      stream,
      toConnectId: toConnectSocketId,
    }

    WebRTCHandler.streamWithIds = [
      ...WebRTCHandler.streamWithIds,
      newStreamWithId,
    ]
  }
}
