import { sio } from '@/app'

sio.on('connection', (socket) => {
  console.log(`client connection: ${socket.id}`)
  socket.on('hello', (...args) => {
    console.log(`hello args:${args}`)
  })
})
