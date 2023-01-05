import React, { useEffect, useState } from 'react'
import {
  selectUserId,
  selectUserInfo,
  selectUserSocketId,
} from '@/redux/features/user/userSlice'
import { useSelector } from 'react-redux'
import {
  selectConnectWithAudioOnly,
  selectRoomId,
  selectRoomParticipants,
  selectRoomStatus,
  selectWebRTCStatus,
} from '@/redux/features/system/systemSlice'
import { notification } from 'antd'
import { WebRTCHandler } from '@/core/webRTCHandler'
import { WebRTC } from '@/common/typings/webRTC'
import { SIO } from '../../../../socket'
import MediaBox, { stopBothVideoAndAudio } from '@/components/MediaBox'
import { useLoadStream } from '@/hooks/useLoadStream'
import { handleLeaveRoom } from '@/core/SocketClient'
import ActionBox from '@/components/ActionBox'

type UserWithStream = SIO.User & Pick<WebRTC.StreamWithId, 'stream'>

const Room: React.FC = () => {
  const [api, contextHolder] = notification.useNotification()

  const { username } = useSelector(selectUserInfo)
  const userId = useSelector(selectUserId)
  const userSocketId = useSelector(selectUserSocketId)
  const audioOnly = useSelector(selectConnectWithAudioOnly)
  const roomId = useSelector(selectRoomId)
  const roomStatus = useSelector(selectRoomStatus)
  const roomParticipants = useSelector(selectRoomParticipants)
  const WebRTCStatus = useSelector(selectWebRTCStatus)

  const [otherUsers, setOtherUsers] = useState<(UserWithStream | null)[]>([])
  const [myself, setMyself] = useState<UserWithStream | null>(null)
  const [allUsers, setAllUsers] = useState<(UserWithStream | null)[]>([])

  const { localStream, streamStatus } = useLoadStream(
    WebRTCHandler.getLocalStream,
  )

  // 加载本地的媒体流及信息
  useEffect(() => {
    if (streamStatus === 'complete') {
      console.log(`LocalStream is completed`)
    }

    setMyself({
      username,
      id: userId,
      roomId,
      socketId: userSocketId,
      audioOnly,
      stream: localStream as MediaStream,
    })
  }, [localStream, userId, userSocketId])

  // 加载其他用户的媒体流及信息
  useEffect(() => {
    const streamWithIds = WebRTCHandler.getRemoteStreamWithIds()
    console.log('streamWithIds', streamWithIds)

    const otherUserWithStreams: (UserWithStream | null)[] = streamWithIds().map(
      (streamWithId) => {
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
      },
    )

    setOtherUsers(
      otherUserWithStreams.filter(
        (item) => item !== null && item.stream.active,
      ),
    )
  }, [roomParticipants, WebRTCStatus])

  // 所有用户
  useEffect(() => {
    setAllUsers([myself, ...otherUsers])
  }, [myself, otherUsers])

  // 监听返回按钮事件
  useEffect(() => {
    if (roomStatus === 'destroyed') {
      handleLeaveRoom()
      localStream && stopBothVideoAndAudio(localStream)
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
          console.log('allUsers', allUsers)

          return element ? (
            <MediaBox
              key={element.id}
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
