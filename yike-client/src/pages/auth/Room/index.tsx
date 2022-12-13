import React, { useEffect } from 'react'
import { getLocalStream } from '@/hooks/useLoadStream'
import { selectUserInfo } from '@/redux/features/user/userSlice'
import { useSelector } from 'react-redux'
import {
  selectConnectWithAudioOnly,
  selectRoomParticipants,
} from '@/redux/features/system/systemSlice'
import CameraBox from '@/components/CameraBox'
import { notification } from 'antd'

const Room: React.FC = () => {
  const [api, contextHolder] = notification.useNotification()

  const { username } = useSelector(selectUserInfo)
  const connectWithAudioOnly = useSelector(selectConnectWithAudioOnly)
  const roomParticipants = useSelector(selectRoomParticipants)

  // 监听用户加入、离开事件
  useEffect(() => {
    if (roomParticipants.length > 0) {
      api.info({
        message: '用户事件',
        placement: 'topLeft',
      })
    }
  }, [roomParticipants])

  return (
    <>
      {contextHolder}
      <div
        id="videos-container"
        className={`relative p-1 w-full h-full gap-3 grid ${
          roomParticipants.length <= 4
            ? 'grid-rows-2 grid-cols-2'
            : 'grid-rows-3 grid-cols-3'
        }`}
      >
        <CameraBox
          withAudioOnly={connectWithAudioOnly}
          getStreamFunction={getLocalStream}
          username={username}
        />
        {roomParticipants ? (
          roomParticipants
            .filter((r) => r.username !== username)
            .map((user) => {
              return (
                <CameraBox
                  key={user.id}
                  withAudioOnly={true}
                  getStreamFunction={getLocalStream}
                  username={user.username}
                />
              )
            })
        ) : (
          <>
            <div></div>
          </>
        )}
      </div>
    </>
  )
}

export default Room
