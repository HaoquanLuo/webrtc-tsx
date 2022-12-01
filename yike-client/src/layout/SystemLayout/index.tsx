import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/api/system/auth'
import {
  removeLogState,
  selectLogState,
} from '@/redux/features/system/systemSlice'
import { removeToken } from '@/redux/features/user/userSlice'
import { Button, Modal } from 'antd'
import { BackwardOutlined, LogoutOutlined } from '@ant-design/icons'

const SystemLayout: React.FC<{ children: React.ReactElement }> = (props) => {
  const { children } = props
  const dispatch = useDispatch()
  const logState = useSelector(selectLogState)

  const { confirm } = Modal

  interface ConfirmOptions {
    title?: string
    content?: string
    icon?: React.ReactNode
    onOkCallback?: () => any | undefined
    onCancelCallback?: () => any | undefined
  }

  const showConfirm = (options: ConfirmOptions) => {
    const { title, content, icon, onOkCallback, onCancelCallback } = options
    confirm({
      title,
      icon,
      content,
      onOk() {
        if (onOkCallback) {
          onOkCallback()
        }
      },
      onCancel() {
        if (onCancelCallback) {
          onCancelCallback()
        }
      },
    })
  }

  async function handleLogout() {
    const { data } = await logout()
    if (data.errorCode === 0 && data.msg === 'ok') {
      dispatch(removeToken())
      dispatch(removeLogState())
    }
  }

  function handlePageBack() {
    history.back()
  }

  return (
    <div flex flex-col w-full h-full relative>
      <div flex bg-gray h-14>
        <Button
          shape="circle"
          onClick={() =>
            showConfirm({
              title: '确定要离开吗?',
              content: '离开不会保存当前数据',
              onOkCallback: handleLogout,
            })
          }
          icon={<BackwardOutlined />}
        />
        {logState && (
          <Button
            onClick={() =>
              showConfirm({
                title: '确定要离开吗?',
                content: '离开不会保存当前数据',
                onOkCallback: handlePageBack,
              })
            }
            shape="circle"
            icon={<LogoutOutlined />}
          />
        )}
      </div>
      {children}
    </div>
  )
}

export default SystemLayout
