import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/api/system/auth'
import { showConfirm } from '@/common/utils/confirm'
import {
  selectCurrentPath,
  setRoomStatus,
  selectRoomId,
  setRoomId,
  setRoomParticipants,
  setConnectWithAudioOnly,
  setRoomHost,
} from '@/redux/features/system/systemSlice'
import {
  selectLogState,
  selectUserInfo,
  setCurrChatTargetTitle,
  setLogState,
  setToken,
  setUserInfo,
} from '@/redux/features/user/userSlice'
import { BackwardOutlined, LogoutOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { removeItem } from '@/common/utils/storage'
import { useNavigate } from 'react-router-dom'
import CopyToClipboard from 'react-copy-to-clipboard'

const SystemHeader: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logState = useSelector(selectLogState)
  const currentPath = useSelector(selectCurrentPath)
  const { username } = useSelector(selectUserInfo)
  const roomId = useSelector(selectRoomId)

  const [showTips, setShowTips] = useState(false)

  async function handleLogout() {
    const { data } = await logout()
    if (data.errorCode === 0 && data.msg === 'ok') {
      dispatch(setToken(''))
      dispatch(setLogState(false))
      dispatch(
        setUserInfo({
          username: 'default user',
          password: 'default password',
        }),
      )

      removeItem('token')
      removeItem('userInfo')

      location.reload()
    }
  }

  function handlePageBack() {
    dispatch(setRoomId(''))
    dispatch(setRoomParticipants([]))
    dispatch(setRoomStatus('destroyed'))
    dispatch(setRoomHost(false))
    dispatch(setConnectWithAudioOnly(true))
    dispatch(setCurrChatTargetTitle(''))

    navigate(-1)
  }

  function handleCopyToClipboard() {
    setShowTips(true)
    setTimeout(() => {
      setShowTips(false)
    }, 1500)
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
      relative
      flex
      items-center
      px-4
      gap-2
      bg-op-10
      bg-gray
      min-h="14!"
    >
      <div className="left-btns" flex w-48 justify-start>
        {<BackButton />}
      </div>
      <div className="center-btns" flex flex-1 justify-center>
        <span mx-2 font-bold>
          {username}
        </span>
        {roomId && (
          <CopyToClipboard onCopy={handleCopyToClipboard} text={roomId}>
            <span>{roomId}</span>
          </CopyToClipboard>
        )}
        {showTips && (
          <span absolute bottom="-4" font-bold b-2 rd-2 px-1 bg-op-40>
            Copied!
          </span>
        )}
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

export default React.memo(SystemHeader)
