import { createRoom, joinRoom, initSocketAndConnect } from '@/core/SocketClient'
import { selectRoomId } from '@/redux/features/system/systemSlice'
import { selectUserInfo } from '@/redux/features/user/userSlice'
import { Button, Input, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Main: React.FC = () => {
  // 控制弹窗显示
  const [isModalOpen, setIsModalOpen] = useState(false)
  // 弹窗中输入的id
  const [joinRoomId, setJoinRoomId] = useState('')
  // store 中取出的用户信息
  const { username } = useSelector(selectUserInfo)
  // store 中取出的，后端生成并返回的房间号
  const roomId = useSelector(selectRoomId)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    joinRoom(joinRoomId, username)
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  // 按钮点击事件
  const handleCreateRoom = () => {
    createRoom(username)
  }
  const handleJoinRoom = () => {
    showModal()
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJoinRoomId(e.target.value)
  }

  useEffect(() => {
    initSocketAndConnect()
  }, [])

  return (
    <>
      <h2>Auth Main</h2>
      <Link to={'/auth/room/1'}>room 1</Link>
      <div>
        <Button onClick={handleCreateRoom}>create room</Button>
        <Button onClick={handleJoinRoom}>join room</Button>
      </div>
      <Modal
        title="加入房间"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>请输入房间号：</p>
        <Input type="text" value={joinRoomId} onChange={handleInput} />
      </Modal>
    </>
  )
}

export default Main
