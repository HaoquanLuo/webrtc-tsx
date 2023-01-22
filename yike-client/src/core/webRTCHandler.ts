import SimplePeer from 'simple-peer'
import { WebRTC } from '@/common/typings/webRTC'
import { SocketClient } from './SocketClient'
import { getStore } from '@/common/utils/getStore'
import { store } from '@/redux/store'
import { setWebRTCStatus } from '@/redux/features/system/systemSlice'
import { setPublicMessages } from '@/redux/features/user/userSlice'

const dispatch = store.dispatch

export class WebRTCHandler {
  /**
   * @description 本地媒体流
   */
  private static localStream: MediaStream | null = null

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
   * @description 获取本地摄像头
   */
  public static async getUserCamera() {
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
   * @description 获取本地媒体流
   * @returns
   */
  public static getLocalStream() {
    return WebRTCHandler.localStream
  }

  /**
   * @description 设置本地媒体流
   * @param streamObject
   */
  public static setLocalStream(streamObject: MediaStream | null) {
    WebRTCHandler.localStream = streamObject
  }

  /**
   * @description 初始化本地媒体流
   */
  public static async initLocalStream() {
    // 若已存在本地媒体流则退出该函数执行
    if (WebRTCHandler.localStream !== null) {
      return
    }

    let localStream: MediaStream = await WebRTCHandler.getUserCamera()

    if (localStream !== null) {
      if (WebRTCHandler.localStream !== null) {
        return
      } else {
        WebRTCHandler.setLocalStream(localStream)
      }
    } else {
      throw new Error(`Cannot get user camera`)
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
    await WebRTCHandler.initLocalStream()

    const configuration = WebRTCHandler.getConfiguration()

    // 实例化对等连接对象
    WebRTCHandler.peers[connSocketId] = new SimplePeer({
      initiator: isInitiator,
      config: configuration,
      stream: WebRTCHandler.localStream as MediaStream,
    })

    // 1. 信令数据传输
    WebRTCHandler.peers[connSocketId].on('signal', (data) => {
      const signalData = {
        signal: data,
        connUserSocketId: connSocketId,
      }

      SocketClient.handleSendSignalData(signalData)
      dispatch(setWebRTCStatus('signaling'))
    })

    // 2. 对等对象连接
    WebRTCHandler.peers[connSocketId].on('connect', () => {
      dispatch(setWebRTCStatus('connected'))
    })

    // 3. 获取媒体流
    WebRTCHandler.peers[connSocketId].on('stream', (stream) => {
      WebRTCHandler.handleAddStream(stream, connSocketId)
      dispatch(setWebRTCStatus('streaming'))
    })

    // 4. 对等对象数据
    WebRTCHandler.peers[connSocketId].on('data', (data) => {
      console.log('data: ' + data)
      const messageData = JSON.parse(data)
      WebRTCHandler.appendNewMessage(messageData)
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
    if (WebRTCHandler.localStream === null) {
      throw new Error(`'WebRTCHandler.localStream' is not exist.`)
    }

    const micFlag = microphoneStatus === 'loud'
    WebRTCHandler.localStream.getAudioTracks()[0].enabled = !micFlag
  }

  /**
   * @description 摄像头控制按钮
   * @param isDisabled
   */
  public static handleToggleCamera(cameraStatus: System.Camera) {
    if (WebRTCHandler.localStream === null) {
      throw new Error(`'WebRTCHandler.localStream' is not exist.`)
    }

    const cameraFlag = cameraStatus === 'off'
    WebRTCHandler.localStream.getVideoTracks()[0].enabled = !cameraFlag
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
    if (WebRTCHandler.localStream === null) {
      throw new Error(`'WebRTCHandler.localStream' is not exist.`)
    }

    screenStatus === 'camera'
      ? WebRTCHandler.switchVideoTracks(WebRTCHandler.localStream)
      : screenStream && WebRTCHandler.switchVideoTracks(screenStream)
  }

  /**
   * @description 切换共享媒体轨道
   * @param streamToShare
   */
  static switchVideoTracks(streamToShare: MediaStream) {
    for (const socketId in WebRTCHandler.peers) {
      for (let index in WebRTCHandler.peers[socketId].streams[0].getTracks()) {
        for (let index2 in streamToShare.getTracks()) {
          // kind 属性规定轨道的种类（eg: audio, video）
          if (
            WebRTCHandler.peers[socketId].streams[0].getTracks()[index].kind ===
            streamToShare.getTracks()[index2].kind
          ) {
            WebRTCHandler.peers[socketId].replaceTrack(
              WebRTCHandler.peers[socketId].streams[0].getTracks()[index],
              streamToShare.getTracks()[index2],
              WebRTCHandler.peers[socketId].streams[0],
            )
          }
        }
      }
    }
  }

  /**
   * @description 保存新消息到本地存储
   * @param message
   */
  public static appendNewMessage(message: User.PublicChatMessage) {
    // 同步到 store 进行保存
    const messages = getStore().user.publicMessages
    dispatch(setPublicMessages([...messages, message]))
  }

  /**
   * @description 通过 data 通道发送聊天信息
   * @param message
   */
  public static sendMessageUsingDataChannel(message: User.PublicChatMessage) {
    // 将本地发送的聊天信息存储到 store
    WebRTCHandler.appendNewMessage(message)

    // 聊天信息发送给远程 webRTC 对等方
    const messageData = {
      ...message,
    }

    const stringifiedMessageData = JSON.stringify(messageData)

    for (const peer in WebRTCHandler.peers) {
      WebRTCHandler.peers[peer].send(stringifiedMessageData)
    }
  }
}
