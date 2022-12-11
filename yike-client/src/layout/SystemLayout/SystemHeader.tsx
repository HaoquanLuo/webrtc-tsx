import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/api/system/auth'
import { showConfirm } from '@/common/utils/confirm'
import {
  selectLogState,
  selectCurrentPath,
  setLogState,
  setRoomStatus,
} from '@/redux/features/system/systemSlice'
import { setToken, setUserInfo } from '@/redux/features/user/userSlice'
import { BackwardOutlined, LogoutOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { removeItem } from '@/common/utils/storage'

const SystemHeader: React.FC = () => {
  const logState = useSelector(selectLogState)
  const currentPath = useSelector(selectCurrentPath)
  const dispatch = useDispatch()

  async function handleLogout() {
    const { data } = await logout()
    if (data.errorCode === 0 && data.msg === 'ok') {
      dispatch(setToken(''))
      dispatch(setLogState(false))
      dispatch(
        setUserInfo({
          username: 'default-username',
          password: 'default-password',
        }),
      )

      removeItem('token')
      removeItem('userInfo')

      location.assign('/')
    }
  }

  function handlePageBack() {
    dispatch(setRoomStatus('loading'))

    history.go(-1)
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
    <div id="system-header" flex items-center px-4 gap-2 bg-gray min-h="14!">
      <div className="left-btns" flex w-48 justify-start>
        {<BackButton />}
      </div>
      <div className="center-btns" flex flex-1 justify-center>
        {logState && <p>center-btns</p>}
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
