import { SIO } from '@/common/typings/socket'
import { useEffect, useRef, useState } from 'react'
import { Socket, io } from 'socket.io-client'

// export const useSocket = () => {
//   const socketRef = useRef<Socket<
//     SIO.ServerToClientEvents,
//     SIO.ClientToServerEvents
//   > | null>(null)
//   const [connectStatus, setConnectStatus] = useState(false)

//   const socket: Socket<SIO.ServerToClientEvents, SIO.ClientToServerEvents> = io(
//     'http://localhost:9000',
//   )

//   useEffect(() => {
//     socket.on('connect', () => {
//       socketRef.current = socket
//       setConnectStatus(true)
//       console.log('connected to server', socketRef.current.connected)
//     })
//     socket.emit('hello', 'ni hao!')

//     return () => {
//       socket.on('disconnect', () => {
//         console.log('disconnected from server', socketRef.current?.connected)
//       })
//       setConnectStatus(false)
//     }
//   }, [])

//   return {
//     socket: socketRef.current,
//     connectStatus,
//   }
// }

export function useSocket() {
  const socketRef = useRef<
    Socket<SIO.ServerToClientEvents, SIO.ClientToServerEvents>
  >(io('http://127.0.0.1:9000'))

  socketRef.current.on('connect', () => {
    console.log('connected to server', socketRef.current.connected)
  })

  socketRef.current.emit('hello', 'world')

  socketRef.current.on('disconnect', () => {
    console.log('disconnected from server', socketRef.current.connected)
  })

  return {
    socket: socketRef.current,
  }
}
