import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { SocketClient } from '@/core/SocketClient'
import {
  selectConnectWithAudioOnly,
  selectRoomHost,
  selectRoomId,
  selectRoomStatus,
  setConnectWithAudioOnly,
  setRoomHost,
  setRoomId,
  selectErrorMessage,
  setErrorMessage,
} from '@/redux/features/system/systemSlice'
import {
  selectUserInfo,
  selectUserSocketId,
} from '@/redux/features/user/userSlice'
import { Button, Input, Modal, Switch, notification } from 'antd'

const Main: React.FC = () => {
  // 工具 hooks
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [api, contextHolder] = notification.useNotification()

  // 控制弹窗显示
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [joinRoomId, setJoinRoomId] = useState('')

  // store 属性
  const errorMessage = useSelector(selectErrorMessage)
  const { username } = useSelector(selectUserInfo)
  const userSocketId = useSelector(selectUserSocketId)
  const audioOnly = useSelector(selectConnectWithAudioOnly)
  const roomId = useSelector(selectRoomId)
  const roomHost = useSelector(selectRoomHost)
  const roomStatus = useSelector(selectRoomStatus)

  // Modal 组件回调事件
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    try {
      if (!roomHost && joinRoomId === '') {
        dispatch(setErrorMessage(`没有输入房间号！`))
        return
      }
      dispatch(setRoomId(joinRoomId))
      roomHost
        ? SocketClient.handleCreateRoom(username, audioOnly)
        : SocketClient.handleJoinRoom(joinRoomId, username, audioOnly)
    } catch (error) {
      console.error(error)
    } finally {
      setJoinRoomId('')
    }
  }

  const handleCancel = () => {
    dispatch(setRoomHost(false))
    setIsModalOpen(false)
  }

  // 按钮点击事件
  const handleCreate = () => {
    dispatch(setRoomHost(true))
    showModal()
  }

  const handleJoin = () => {
    dispatch(setRoomHost(false))
    showModal()
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJoinRoomId(e.target.value)
  }

  const handleSwitch = () => {
    dispatch(setConnectWithAudioOnly(!audioOnly))
  }

  // 进入 Main 页面初始化 socket 实例
  useEffect(() => {
    if (userSocketId === '') {
      SocketClient.initSocketAndConnect()
    }
  }, [userSocketId])

  // 监听 roomStatus 来判断是否有创建房间
  useEffect(() => {
    if (roomStatus === 'created' || roomStatus === 'existed') {
      navigate(`/auth/room/${roomId}`)
    }
  }, [roomStatus, roomId])

  // 监听 errorMessage
  useEffect(() => {
    if (errorMessage) {
      api.error({
        message: errorMessage,
        placement: 'top',
      })
    }
  }, [errorMessage])

  return (
    <>
      {contextHolder}
      <h2>Auth Main</h2>
      <div>
        <Button onClick={handleCreate}>创建房间</Button>
        <Button onClick={handleJoin}>加入房间</Button>
      </div>
      <Modal
        title={roomHost ? '创建房间' : '加入房间'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div flex flex-col gap-y-2 p-2 font-500 text-base>
          <div>
            {roomHost ? (
              <div flex text-center>
                <i i-mdi-vector-link text-5xl mx-4></i>
              </div>
            ) : (
              <div flex text-center>
                <i i-mdi-link text-5xl mx-4></i>
                <Input
                  placeholder="请输入房间 id"
                  type="text"
                  value={joinRoomId}
                  onChange={handleInput}
                />
              </div>
            )}
          </div>
          <div flex flex-col justify-end gap-1>
            <div>连接选项</div>
            <div>
              <Switch
                checked={audioOnly}
                checkedChildren="仅音频"
                unCheckedChildren="音视频"
                onChange={handleSwitch}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default React.memo(Main)
