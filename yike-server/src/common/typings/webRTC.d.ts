import SimplePeer from 'simple-peer'

export namespace WebRTC {
  type DataPrepare = {
    connUserSocketId: string
  }
  type DataInit = {
    connUserSocketId: string
  }
  type DataSignal = {
    connUserSocketId: string
    signal: SimplePeer.SignalData
  }
  type StreamWithId = {
    stream: MediaStream
    toConnectId: string
  }
}
