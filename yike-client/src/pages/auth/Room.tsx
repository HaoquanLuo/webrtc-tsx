import React, { useEffect, useState } from 'react'
import {
  selectUserId,
  selectUserInfo,
  selectUserSocketId,
} from '@/redux/features/user/userSlice'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { SIO } from '../../../../socket'
import { notification } from 'antd'
import { SocketClient } from '@/core/SocketClient'
import { WebRTCHandler } from '@/core/webRTCHandler'
import {
  selectConnectWithAudioOnly,
  selectRoomId,
  selectRoomParticipants,
  selectRoomStatus,
  selectWebRTCStatus,
} from '@/redux/features/system/systemSlice'
import { WebRTC } from '@/common/typings/webRTC'
import MediaBox from '@/components/MediaBox'
import ActionBox from '@/components/ActionBox'
import { useLoadStream } from '@/hooks/useLoadStream'

type UserWithStream = SIO.User & Pick<WebRTC.StreamWithId, 'stream'>

const Room: React.FC = () => {
  const navigate = useNavigate()
  const [api, contextHolder] = notification.useNotification()

  const { username } = useSelector(selectUserInfo)
  const userId = useSelector(selectUserId)
  const userSocketId = useSelector(selectUserSocketId)
  const audioOnly = useSelector(selectConnectWithAudioOnly)
  const roomId = useSelector(selectRoomId)
  const roomStatus = useSelector(selectRoomStatus)
  const roomParticipants = useSelector(selectRoomParticipants)
  const webRTCStatus = useSelector(selectWebRTCStatus)

  const [myself, setMyself] = useState<UserWithStream | null>(null)
  const [otherUsers, setOtherUsers] = useState<(UserWithStream | null)[]>([])
  const [allUsers, setAllUsers] = useState<(UserWithStream | null)[]>([])

  try {
    const { localStream, streamStatus } = useLoadStream(
      WebRTCHandler.getLocalStream,
    )

    // 加载本地的媒体流及信息
    useEffect(() => {
      if (streamStatus === 'completed') {
        console.log(`LocalStream is completed`, localStream)

        setMyself({
          username,
          id: userId,
          roomId,
          socketId: userSocketId,
          audioOnly,
          stream: localStream as MediaStream,
        })
      }
    }, [userId, userSocketId, localStream])

    // 加载其他用户的媒体流及信息
    useEffect(() => {
      if (webRTCStatus !== 'uninitialized') {
        const streamWithIds = WebRTCHandler.getRemoteStreamWithIds()

        const otherUserWithStreams: (UserWithStream | null)[] =
          streamWithIds().map((streamWithId) => {
            const { stream, toConnectId } = streamWithId

            const matchUser = roomParticipants.find(
              (participant) => toConnectId === participant.socketId,
            )

            if (matchUser === undefined) {
              return null
            } else {
              return {
                ...matchUser,
                stream,
              }
            }
          })

        setOtherUsers(
          otherUserWithStreams.filter(
            (item) => item !== null && item.stream.active,
          ),
        )
      }
    }, [roomParticipants, webRTCStatus])

    // 所有用户
    useEffect(() => {
      setAllUsers([myself, ...otherUsers])
    }, [myself, otherUsers])

    // 监听返回按钮事件
    useEffect(() => {
      if (roomStatus === 'destroyed') {
        SocketClient.handleLeaveRoom()

        setMyself(null)
        setOtherUsers([])
        setAllUsers([])

        navigate('/')
      }
    }, [roomStatus])

    // 监听用户加入、离开事件
    useEffect(() => {
      if (roomParticipants.length > 1) {
        api.info({
          message: '用户事件',
          placement: 'bottomLeft',
        })
      }
    }, [roomParticipants])
  } catch (e) {
    console.error(e)
  }

  return (
    <>
      {contextHolder}
      <div
        id="videos-container"
        className={`relative w-full h-full gap-3 grid ${
          roomParticipants.length <= 4
            ? 'grid-rows-2 grid-cols-2'
            : 'grid-rows-3 grid-cols-3'
        }`}
      >
        {allUsers.map((element) => {
          return element ? (
            <MediaBox
              key={element.socketId}
              audioOnly={element.audioOnly}
              userName={element.username}
              srcObject={element.stream}
            />
          ) : null
        })}
      </div>
      <ActionBox />
    </>
  )
}

export default React.memo(Room)
