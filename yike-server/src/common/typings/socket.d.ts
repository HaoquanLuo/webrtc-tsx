export namespace SIO {
  interface ServerToClientEvents {}

  interface ClientToServerEvents {
    hello: () => void
  }

  interface InterServiceEvents {
    ping: () => void
  }

  interface SocketData {}
}
