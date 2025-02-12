import { SIO } from '@/common/typings/socket'
import { selectUserInfo } from '@/redux/features/user/userSlice'
import React from 'react'
import { useSelector } from 'react-redux'

interface Props {
  message: Partial<SIO.Message> & {
    sameAuthor: boolean
  }
}

const MessageBox: React.FC<Props> = (props) => {
  const { message } = props

  const { username } = useSelector(selectUserInfo)

  return (
    <div key={message.id} className={`my-1`}>
      {message.senderName && !message.sameAuthor && (
        <div
          className={`font-bold text-sm mx-1 dark:text-gray-3 ${
            message.senderName === username ? 'text-right' : 'text-left'
          }`}
        >
          {message.senderName === username ? '我' : message.senderName}
        </div>
      )}
      <div
        className={`px-2 py-1 bg-violet-6 text-white rd-2 w-fit ${
          message.senderName === username ? 'float-right' : 'float-left'
        }`}
      >
        {message.messageContent}
      </div>
    </div>
  )
}

export default MessageBox
