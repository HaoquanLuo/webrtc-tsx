import { SIO } from '@/common/typings/socket'
import { useEffect, useRef } from 'react'
import { Socket, io } from 'socket.io-client'

export function useSocket() {
  const socketRef = useRef<string>('')

  useEffect(() => {
    const socket: Socket<SIO.ServerToClientEvents, SIO.ClientToServerEvents> =
      io('http://localhost:9000')
    socket.on('connect', () => {
      console.log(`server received connection: ${socket.id}`)
      socketRef.current = socket.id
    })
    socket.emit('hello', 'ni hao!')
  }, [])

  return socketRef.current
}
