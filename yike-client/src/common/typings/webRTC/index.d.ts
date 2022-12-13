export namespace WebRTC {
  type DataPrepare = {
    toConnectSocketId: string
  }
  type DataInit = {
    toConnectSocketId: string
  }
  type DataSignal = {
    toConnectSocketId: string
    signal: SimplePeer.SignalData
  }
}
