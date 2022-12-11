import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { createRoom, joinRoom, initSocketAndConnect } from '@/core/SocketClient'
import {
  selectConnectOnlyWithAudio,
  selectRoomHost,
  selectRoomId,
  selectRoomStatus,
  setConnectOnlyWithAudio,
  setRoomHost,
  setRoomId,
} from '@/redux/features/system/systemSlice'
import { selectUserInfo } from '@/redux/features/user/userSlice'
import { Button, Input, Modal, Switch } from 'antd'

const Main: React.FC = () => {
  // 工具 hooks
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // 控制弹窗显示
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [joinRoomId, setJoinRoomId] = useState('')
  // store 属性
  const { username } = useSelector(selectUserInfo)
  const isAudioOnly = useSelector(selectConnectOnlyWithAudio)
  const roomId = useSelector(selectRoomId)
  const roomHost = useSelector(selectRoomHost)
  const roomStatus = useSelector(selectRoomStatus)
  // Modal 组件回调事件
  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleOk = () => {
    roomHost ? createRoom(username) : joinRoom(joinRoomId, username)
    setIsModalOpen(false)
    setJoinRoomId('')
  }
  const handleCancel = () => {
    dispatch(setRoomHost(false))
    setIsModalOpen(false)
  }
  // 按钮点击事件
  const handleCreateRoom = () => {
    dispatch(setRoomHost(true))
    showModal()
  }
  const handleJoinRoom = () => {
    dispatch(setRoomHost(false))
    showModal()
  }
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJoinRoomId(e.target.value)
  }
  const handleSwitch = () => {
    dispatch(setConnectOnlyWithAudio(!isAudioOnly))
  }
  // 加入 Main 页面初始化 socket 实例
  useEffect(() => {
    initSocketAndConnect()
  }, [])
  // 监听 roomStatus 来判断是否跳转页面
  useEffect(() => {
    if (roomStatus === 'created') {
      navigate(`/auth/room/${roomId}`)
    }
  }, [roomStatus])

  return (
    <>
      <h2>Auth Main</h2>
      <div>
        <Button onClick={handleCreateRoom}>create room</Button>
        <Button onClick={handleJoinRoom}>join room</Button>
      </div>
      <Modal
        title={roomHost ? '创建房间' : '加入房间'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div flex flex-col gap-y-1 p-2 font-500>
          {roomHost ? (
            <>
              <div text-lg ml-4>
                正在创建房间...
              </div>
            </>
          ) : (
            <>
              <div>请输入房间号：</div>
              <Input type="text" value={joinRoomId} onChange={handleInput} />
            </>
          )}
          <div>连接选项</div>
          <div>
            <Switch
              checked={isAudioOnly}
              checkedChildren="仅音频"
              unCheckedChildren="音视频"
              onChange={handleSwitch}
            />
          </div>
        </div>
      </Modal>
    </>
  )
}

export default Main
