import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/api/system/auth'
import { showConfirm } from '@/common/utils/confirm'
import {
  selectLogState,
  selectCurrentPath,
  setLogState,
  setRoomStatus,
  selectRoomId,
  setRoomId,
  setRoomParticipants,
  setConnectWithAudioOnly,
  setRoomHost,
} from '@/redux/features/system/systemSlice'
import {
  selectUserInfo,
  setToken,
  setUserId,
  setUserInfo,
} from '@/redux/features/user/userSlice'
import { BackwardOutlined, LogoutOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { removeItem } from '@/common/utils/storage'
import { useNavigate } from 'react-router-dom'

const SystemHeader: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logState = useSelector(selectLogState)
  const currentPath = useSelector(selectCurrentPath)
  const { username } = useSelector(selectUserInfo)
  const roomId = useSelector(selectRoomId)

  async function handleLogout() {
    const { data } = await logout()
    if (data.errorCode === 0 && data.msg === 'ok') {
      dispatch(setToken(''))
      dispatch(setLogState(false))

      removeItem('token')
      removeItem('userInfo')

      navigate('/')
    }
  }

  function handlePageBack() {
    dispatch(setRoomId(''))
    dispatch(setRoomParticipants([]))
    dispatch(setRoomStatus('uninitialized'))
    dispatch(setUserId(''))
    dispatch(setConnectWithAudioOnly(true))
    dispatch(setRoomHost(false))

    navigate(-1)
  }

  /**
   * 根据路径判断是否显示 `返回按钮`
   */
  const BackButton = () => {
    return currentPath !== '/' ? (
      <Button
        shape="circle"
        icon={<BackwardOutlined />}
        onClick={() =>
          showConfirm({
            title: '确定要离开吗?',
            content: '离开不会保存当前数据',
            onOkCallback: handlePageBack,
          })
        }
      />
    ) : null
  }

  return (
    <div
      id="system-header"
      flex
      items-center
      px-4
      gap-2
      bg-op-10
      bg-white
      min-h="14!"
    >
      <div className="left-btns" flex w-48 justify-start>
        {<BackButton />}
      </div>
      <div className="center-btns" flex flex-1 justify-center>
        <span mx-2 font-bold>
          {username}
        </span>
        {roomId && <span>{roomId}</span>}
      </div>
      <div className="right-btns" flex w-48 justify-end>
        {logState && (
          <Button
            shape="circle"
            icon={<LogoutOutlined />}
            onClick={() =>
              showConfirm({
                title: '确定要退出吗?',
                content: '离开不会保存当前数据',
                onOkCallback: handleLogout,
              })
            }
          />
        )}
      </div>
    </div>
  )
}

export default SystemHeader
