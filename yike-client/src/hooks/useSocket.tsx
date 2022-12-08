import { SIO } from '@/common/typings/socket'
import { useEffect } from 'react'
import { Socket, io } from 'socket.io-client'

/**
 * @description 创建 Socket 对象
 */
export const useSocket = () => {
  const socket: Socket<SIO.ServerToClientEvents, SIO.ClientToServerEvents> = io(
    'http://127.0.0.1:9000',
  )

  useEffect(() => {
    // 建立 socket 连接
    socket.connect()
    socket.on('connect', () => {
      console.log('connected to server', socket.id)
      socket.emit('hello', `hello from ${socket.id}`)
    })
    return () => {
      console.log('run cleanup')
      // 断开 socket 连接
      socket.disconnect()
      socket.on('disconnect', () => {
        console.log('disconnected from server')
      })
    }
  }, [])

  return { socket }
}
