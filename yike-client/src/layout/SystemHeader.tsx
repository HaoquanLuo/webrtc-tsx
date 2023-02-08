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
  selectRoomStatus,
  selectSystemTheme,
  setSystemTheme,
} from '@/redux/features/system/systemSlice'
import {
  selectLogState,
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
import IconContainer from '@/components/IconContainer/IconContainer'
import { SystemThemeHandler } from '@/common/utils/theme'

/**
 * 根据路径判断是否显示 `返回按钮`
 */
const BackButton: React.FC<{
  currentPath: string
  handleButtonClick: () => void
}> = ({ currentPath, handleButtonClick }) => {
  return currentPath === '/' || currentPath === '/main' ? null : (
    <Button
      shape="circle"
      icon={<BackwardOutlined />}
      onClick={handleButtonClick}
    />
  )
}

const SystemHeader: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const systemTheme = useSelector(selectSystemTheme)
  const logState = useSelector(selectLogState)
  const currentPath = useSelector(selectCurrentPath)
  const roomId = useSelector(selectRoomId)
  const roomStatus = useSelector(selectRoomStatus)

  const [showCopied, setShowCopied] = useState(false)
  const [showTips, setShowTips] = useState(false)

  function handlePageBack() {
    dispatch(setRoomId(''))
    dispatch(setRoomParticipants([]))
    dispatch(setRoomStatus('destroyed'))
    dispatch(setRoomHost(false))
    dispatch(setConnectWithAudioOnly(true))
    dispatch(setCurrChatTargetTitle(''))

    navigate(-1)
  }

  function handleToggleTheme() {
    SystemThemeHandler.toggleTheme()
    dispatch(setSystemTheme(SystemThemeHandler.getTheme()))
  }

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

  function handleButtonClick() {
    logState &&
      showConfirm({
        title: '确定要离开吗?',
        content: '离开不会保存当前数据',
        onOkCallback: handlePageBack,
      })
  }

  function handleCopyToClipboard() {
    setShowCopied(true)
    setTimeout(() => {
      setShowCopied(false)
    }, 1500)
  }

  function handleTipsMouseEnter() {
    setShowTips(true)
  }

  function handleTipsMouseLeave() {
    setTimeout(() => {
      setShowTips(false)
    }, 500)
  }

  return (
    <div
      id="system-header"
      relative
      flex
      items-center
      px-6
      gap-2
      min-h="14!"
      dark="~ text-gray-3"
    >
      <div className="left-btns" flex w-48 justify-start>
        <BackButton
          currentPath={currentPath}
          handleButtonClick={handleButtonClick}
        />
      </div>
      <div className="center-btns" flex flex-1 justify-center>
        {roomId && (
          <CopyToClipboard onCopy={handleCopyToClipboard} text={roomId}>
            <div>
              <span mx-2 font-bold>
                房间号:
              </span>
              <span
                onMouseEnter={handleTipsMouseEnter}
                onMouseLeave={handleTipsMouseLeave}
              >
                {roomId}
              </span>
            </div>
          </CopyToClipboard>
        )}
        {showTips && (
          <span absolute bottom="0" px-1 text-gray-4 text-sm>
            点击复制
          </span>
        )}
        {showCopied && (
          <span absolute bottom="-4" font-bold b-2 rd-2 px-1 bg-gray-1 bg-op-20>
            Copied!
          </span>
        )}
      </div>
      <div className="right-btns" flex gap-4 w-48 justify-end>
        <IconContainer
          Icon={
            <div
              className={`${
                systemTheme === 'dark'
                  ? 'i-mdi:white-balance-sunny'
                  : 'i-fluent:weather-moon-48-regular'
              }`}
            />
          }
          handleClick={handleToggleTheme}
        />
        {logState && roomStatus === 'unbuild' && (
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
