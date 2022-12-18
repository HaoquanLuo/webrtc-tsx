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
  selectWebRTCStatus,
} from '@/redux/features/system/systemSlice'
import { notification } from 'antd'
import { WebRTCHandler } from '@/core/webRTCHandler'
import { WebRTC } from '@/common/typings/webRTC'
import { SIO } from '../../../../socket'
import MediaBox from '@/components/MediaBox'

type UserWithStream = SIO.User & Pick<WebRTC.StreamWithId, 'stream'>

const Room: React.FC = () => {
  const [api, contextHolder] = notification.useNotification()

  const { username } = useSelector(selectUserInfo)
  const userId = useSelector(selectUserId)
  const userSocketId = useSelector(selectUserSocketId)
  const roomId = useSelector(selectRoomId)
  const audioOnly = useSelector(selectConnectWithAudioOnly)
  const roomParticipants = useSelector(selectRoomParticipants)
  const WebRTCStatus = useSelector(selectWebRTCStatus)

  const [otherUsers, setOtherUsers] = useState<(UserWithStream | null)[]>([])
  const [myself, setMyself] = useState<UserWithStream | null>(null)
  const [allUsers, setAllUsers] = useState<(UserWithStream | null)[]>([])

  // 加载本地的媒体流及信息
  useEffect(() => {
    ;(async () => {
      const local = await WebRTCHandler.getLocalStream()

      if (!local) {
        throw new Error(`Could not get local stream`)
      }

      setMyself({
        username,
        id: userId,
        roomId,
        socketId: userSocketId,
        audioOnly,
        stream: local,
      })
    })()
  }, [userId, userSocketId])

  // 加载其他用户的媒体流及信息
  useEffect(() => {
    const streamWithIds = WebRTCHandler.getRemoteStream()

    const otherUserWithStreams: (UserWithStream | null)[] = streamWithIds.map(
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

    setOtherUsers(otherUserWithStreams)
  }, [roomParticipants, WebRTCStatus])

  // 所有用户
  useEffect(() => {
    setAllUsers([myself, ...otherUsers])
  }, [myself, otherUsers])

  // 监听用户加入、离开事件
  useEffect(() => {
    if (roomParticipants.length > 0) {
      api.info({
        message: '用户事件',
        placement: 'bottomRight',
      })
    }
  }, [roomParticipants])

  const VideosContainer: React.FC<{ elements: (UserWithStream | null)[] }> = (
    props,
  ) => {
    const { elements } = props
    return (
      <div
        id="videos-container"
        className={`relative p-1 w-full h-full gap-3 grid ${
          roomParticipants.length <= 4
            ? 'grid-rows-2 grid-cols-2'
            : 'grid-rows-3 grid-cols-3'
        }`}
      >
        {elements.map((element) => {
          return element ? (
            <MediaBox
              key={element.id}
              audioOnly={element.audioOnly}
              username={element.username}
              srcObject={element.stream}
            />
          ) : null
        })}
      </div>
    )
  }

  return (
    <>
      {contextHolder}
      <VideosContainer elements={allUsers} />
    </>
  )
}

export default React.memo(Room)
