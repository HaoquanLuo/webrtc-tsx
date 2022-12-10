export namespace SIO {
  interface ServerToClientEvents {
    welcome: (...args: any[]) => void
    'room-id': (roomId: string) => void
  }

  interface ClientToServerEvents {
    hello: () => void
    'room-create': (data: SocketData) => void
    'room-join': (data: SocketData) => void
  }

  interface InterServiceEvents {
    ping: () => void
  }

  interface SocketData {
    roomId?: string
    userId?: string
  }
}
