import { Modal } from 'antd'

interface ConfirmOptions {
  title?: string
  content?: string
  icon?: React.ReactNode
  onOkCallback?: () => any
  onCancelCallback?: () => any
}

const { confirm } = Modal

export const showConfirm = (options: ConfirmOptions) => {
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
