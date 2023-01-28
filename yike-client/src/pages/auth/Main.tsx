import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { SocketClient } from '@/core/SocketClientEventHandler'
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
  setWebRTCStatus,
  setRoomStatus,
  selectWebRTCStatus,
} from '@/redux/features/system/systemSlice'
import {
  selectUserInfo,
  selectUserSocketId,
} from '@/redux/features/user/userSlice'
import { Input, Modal, Switch, notification } from 'antd'

// notification 全局配置
notification.config({
  duration: 2,
})

function calcTime(value: number) {
  if (value > 0 && value <= 5) {
    return '凌晨好'
  }
  if (value > 5 && value <= 9) {
    return '早上好'
  }
  if (value >= 9 && value < 12) {
    return '上午好'
  }
  if (value >= 12 && value < 13) {
    return '中午好'
  }
  if (value >= 13 && value < 19) {
    return '下午好'
  }
  if (value >= 19 && value < 24) {
    return '晚上好'
  }
}

const Main: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [api, contextHolder] = notification.useNotification()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [joinRoomId, setJoinRoomId] = useState('')
  const [nowTimeStr, setNowTimeStr] = useState<string>('')

  const errorMessage = useSelector(selectErrorMessage)
  const { username } = useSelector(selectUserInfo)
  const userSocketId = useSelector(selectUserSocketId)
  const audioOnly = useSelector(selectConnectWithAudioOnly)
  const roomId = useSelector(selectRoomId)
  const roomHost = useSelector(selectRoomHost)
  const roomStatus = useSelector(selectRoomStatus)
  const webRTCStatus = useSelector(selectWebRTCStatus)

  // Modal 组件回调事件
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    try {
      if (!roomHost && joinRoomId === '') {
        dispatch(
          setErrorMessage({
            key: `error_${Date.now()}`,
            content: `没有输入房间号！`,
          }),
        )
        return
      }

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

  // 进入 Main 页面进行初始化
  useEffect(() => {
    if (userSocketId === '') {
      SocketClient.initSocketAndConnect()
    }

    if (roomStatus !== 'unbuild') {
      dispatch(setRoomStatus('unbuild'))
    }

    if (webRTCStatus !== 'uninitialized') {
      dispatch(setWebRTCStatus('uninitialized'))
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
    if (errorMessage.content !== '') {
      api.error({
        message: errorMessage.content,
        placement: 'top',
      })
    }
  }, [errorMessage])

  useEffect(() => {
    let timer = setInterval(() => {
      const nowTime = new Date().getHours()

      setNowTimeStr(`${calcTime(nowTime) as string}，${username}!`)
    })

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <div w-full h-full grid place-items-center>
      {contextHolder}
      <div flex flex-col h="80%" gap-y-16>
        <div px-10 h-10>
          <span text-8 font-bold vertical-baseline>
            {nowTimeStr}
          </span>
        </div>
        <div flex gap-12 text-center>
          <div
            className="w-60 h-60 p-4 cursor-pointer rd-36 flex flex-col justify-start items-center"
            hover="~ drop-shadow-[0_35px_35px_rgba(124,58,237,1)]"
            onClick={handleCreate}
          >
            <div
              i-fluent:protocol-handler-24-regular
              w-50
              h-50
              hover="~ text-violet-6"
            ></div>
            <div>创建房间</div>
          </div>
          <div
            className="w-60 h-60 p-4 cursor-pointer rd-36 flex flex-col justify-start items-center"
            hover="~ drop-shadow-[0_35px_35px_rgba(251,146,60,1)]"
            onClick={handleJoin}
          >
            <div
              i-fluent:conference-room-48-regular
              w-50
              h-50
              hover="~ text-orange-4"
            ></div>
            <div>加入房间</div>
          </div>
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
      </div>
    </div>
  )
}

export default React.memo(Main)
