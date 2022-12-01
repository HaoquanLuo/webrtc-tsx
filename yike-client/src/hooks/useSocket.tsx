import { SIO } from '@/common/typings/socket'
import { useEffect } from 'react'
import { Socket, io } from 'socket.io-client'

export function useSocket() {
  useEffect(() => {
    const socket: Socket<SIO.ServerToClientEvents, SIO.ClientToServerEvents> =
      io('http://localhost:9000')
    socket.on('connect', () => {
      console.log(`server received connection: ${socket.id}`)
      console.log(socket.id)
    })
    socket.emit('hello', 'ni hao!')
  }, [])
}
