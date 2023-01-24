import React from 'react'
import { useMsgScrollToView } from '@/hooks/useScrollToView'
import MessageBox from './MessageBox'

interface MessageContainerProps {
  messages: User.ChatMessage[]
}

const MessageContainer: React.FC<MessageContainerProps> = (props) => {
  const { messages } = props

  const scrollRef = useMsgScrollToView(messages)

  return (
    <div flex-1 flex flex-col px-1 mt="15.5" overflow-y-scroll rd-2>
      {messages?.map((msg, index) => {
        const sameAuthor =
          index > 0 && msg.senderName === messages[index - 1].senderName

        return <MessageBox key={msg.id} message={{ ...msg, sameAuthor }} />
      })}
      <div ref={scrollRef}></div>
    </div>
  )
}

export default React.memo(MessageContainer)
