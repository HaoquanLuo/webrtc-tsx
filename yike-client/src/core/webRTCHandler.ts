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
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      WebRTCHandler.localStream = stream
      return stream
    } catch (err: any) {
      throw new Error(err)
    }
  }

  /**
   * @description 获取远程媒体流
   */
  public static getRemoteStreamWithIds() {
    return () => WebRTCHandler.streamWithIds
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
    const configuration = WebRTCHandler.getConfiguration()

    // 实例化对等连接对象
    WebRTCHandler.peers[connSocketId] = new SimplePeer({
      initiator: isInitiator,
      config: configuration,
      stream: WebRTCHandler.localStream,
    })

    // 1. 信令数据传输
    WebRTCHandler.peers[connSocketId].on('signal', (data) => {
      const signalData = {
        signal: data,
        connUserSocketId: connSocketId,
      }

      SocketClient.sendSignalData(signalData)
      dispatch(setWebRTCStatus('signaling'))
    })

    // 2. 对等对象连接
    WebRTCHandler.peers[connSocketId].on('connect', () => {
      WebRTCHandler.peers[connSocketId].send('whatever' + Math.random())

      dispatch(setWebRTCStatus('connected'))
    })

    // 3. 对等对象数据
    WebRTCHandler.peers[connSocketId].on('data', (data) => {
      console.log('data: ' + data)
      dispatch(setWebRTCStatus('dataing'))
    })

    // 4. 获取媒体流
    WebRTCHandler.peers[connSocketId].on('stream', (stream) => {
      WebRTCHandler.handleAddStream(stream, connSocketId)
      dispatch(setWebRTCStatus('streaming'))
    })

    // 5. 对等连接关闭
    WebRTCHandler.peers[connSocketId].on('close', () => {
      delete WebRTCHandler.peers[connSocketId]

      dispatch(setWebRTCStatus('disconnected'))
    })

    WebRTCHandler.peers[connSocketId].on('error', (err) => {
      console.error(err)
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
  static handleAddStream(stream: MediaStream, toConnectSocketId: string) {
    const newStreamWithId: WebRTC.StreamWithId = {
      stream,
      toConnectId: toConnectSocketId,
    }

    WebRTCHandler.streamWithIds = [
      ...WebRTCHandler.streamWithIds,
      newStreamWithId,
    ]
  }

  /**
   * @description 移除 peer 对象
   * @param data
   */
  public static handleRemovePeerConnection(data: WebRTC.DataDestroy) {
    const { socketId } = data

    if (WebRTCHandler.peers[socketId]) {
      WebRTCHandler.peers[socketId].destroy()
      delete WebRTCHandler.peers[socketId]
      WebRTCHandler.streamWithIds = WebRTCHandler.streamWithIds.filter(
        (item) => item.toConnectId !== socketId,
      )
    }
  }

  /**
   * @description 麦克风控制按钮
   * @param microphoneStatus
   */
  public static handleToggleMicrophone(microphoneStatus: System.Microphone) {
    const micFlag = microphoneStatus === 'loud'
    WebRTCHandler.localStream.getAudioTracks()[0].enabled = micFlag
      ? false
      : true
  }

  /**
   * @description 摄像头控制按钮
   * @param isDisabled
   */
  public static handleToggleCamera(cameraStatus: System.Camera) {
    const cameraFlag = cameraStatus === 'off'
    WebRTCHandler.localStream.getVideoTracks()[0].enabled = cameraFlag
      ? false
      : true
  }

  /**
   * @description 屏幕共享控制按钮
   * @param isScreenActive
   * @param shareStream
   */
  public static handleToggleScreenShare(
    screenStatus: System.ScreenShare,
    screenStream?: MediaStream,
  ) {
    screenStatus === 'camera'
      ? WebRTCHandler.switchVideoTracks(WebRTCHandler.localStream)
      : screenStream && WebRTCHandler.switchVideoTracks(screenStream)
  }

  /**
   * @description 切换共享媒体轨道
   * @param streamToShare
   */
  static switchVideoTracks(streamToShare: MediaStream) {
    for (const peer in WebRTCHandler.peers) {
      for (let index in WebRTCHandler.peers[peer].streams[0].getTracks()) {
        for (let index2 in streamToShare.getTracks()) {
          // kind 属性规定轨道的种类（eg: audio, video）
          if (
            WebRTCHandler.peers[peer].streams[0].getTracks()[index].kind ===
            streamToShare.getTracks()[index2].kind
          ) {
            WebRTCHandler.peers[peer].replaceTrack(
              WebRTCHandler.peers[peer].streams[0].getTracks()[index],
              streamToShare.getTracks()[index2],
              WebRTCHandler.peers[peer].streams[0],
            )
          }
        }
      }
    }
  }
}
