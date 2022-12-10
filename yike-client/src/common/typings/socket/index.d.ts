export namespace SIO {
  interface ServerToClientEvents {
    welcome: (...args: any[]) => void
    'room-id': (roomId: string) => void
  }

  interface ClientToServerEvents {
    hello: (greet: string) => void
    'room-create': (data: any) => void
  }

  interface InterServiceEvents {
    ping: () => void
  }

  interface SocketData {
    roomId?: string
    userId?: string
  }
}
