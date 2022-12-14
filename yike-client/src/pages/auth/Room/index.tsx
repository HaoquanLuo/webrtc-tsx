import React, { useEffect, useState } from 'react'
import { selectUserInfo } from '@/redux/features/user/userSlice'
import { useSelector } from 'react-redux'
import {
  selectConnectWithAudioOnly,
  selectRoomParticipants,
} from '@/redux/features/system/systemSlice'
import CameraBox from '@/components/CameraBox'
import { notification } from 'antd'
import { getLocalStream, getRemoteStream } from '@/core/webRTCHandler'
import { WebRTC } from '@/common/typings/webRTC'
import { SIO } from '../../../../../socket'

type UserWithStream = SIO.User & Pick<WebRTC.StreamWithId, 'stream'>

const Room: React.FC = () => {
  const [api, contextHolder] = notification.useNotification()

  const { username } = useSelector(selectUserInfo)
  const connectWithAudioOnly = useSelector(selectConnectWithAudioOnly)
  const roomParticipants = useSelector(selectRoomParticipants)

  const [participantWithStream, setParticipantWithStream] = useState<
    (UserWithStream | null)[]
  >([])

  useEffect(() => {
    ;(async () => {
      let streamWithIds = await getRemoteStream()

      const OtherUserWithStreams: (UserWithStream | null)[] = streamWithIds.map(
        (streamWithId) => {
          const { stream, toConnectId } = streamWithId
          const matchUser = roomParticipants.find(
            (participant) => toConnectId === participant.id,
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
      setParticipantWithStream(OtherUserWithStreams)
    })()
  }, [roomParticipants])

  // 监听用户加入、离开事件
  useEffect(() => {
    if (roomParticipants.length > 0) {
      api.info({
        message: '用户事件',
        placement: 'bottomRight',
      })
    }
  }, [roomParticipants])

  const VideosContainer: React.FC = () => {
    const OtherUsers = participantWithStream.map((user) => {
      return user ? (
        <CameraBox
          key={user.id}
          withAudioOnly={user.audioOnly}
          getStreamFunction={getLocalStream}
          username={user.username}
        />
      ) : (
        <div>Oops!</div>
      )
    })
    const Myself = React.memo(() => (
      <CameraBox
        withAudioOnly={connectWithAudioOnly}
        getStreamFunction={getLocalStream}
        username={username}
      />
    ))
    const AllUsers = [Myself, ...OtherUsers]

    return (
      <div
        id="videos-container"
        className={`relative p-1 w-full h-full gap-3 grid ${
          roomParticipants.length <= 4
            ? 'grid-rows-2 grid-cols-2'
            : 'grid-rows-3 grid-cols-3'
        }`}
      >
        {/* {AllUsers} */}
        <Myself />
      </div>
    )
  }
  return (
    <>
      {contextHolder}
      <VideosContainer />
    </>
  )
}

export default React.memo(Room)
