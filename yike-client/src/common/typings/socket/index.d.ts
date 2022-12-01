export namespace SIO {
  interface ServerToClientEvents {}

  interface ClientToServerEvents {
    hello: (greet: string) => void
  }

  interface InterServiceEvents {
    ping: () => void
  }

  interface SocketData {}
}
