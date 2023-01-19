import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectRoomParticipants } from '@/redux/features/system/systemSlice'
import IconBox from '@/components/IconBox'
import MessageBox, { Message } from '@/components/MessageBox'
import { useMsgScrollToView } from '@/hooks/useScrollToView'
import { selectUserInfo } from '@/redux/features/user/userSlice'
import { useDebounceValue } from '@/hooks/useDebounce'
import { notification } from 'antd'

interface Props {}

const msgs = [
  {
    id: '1',
    content: `Hello everyone! I'm YingLong Ma`,
    author: 'YingLong Ma',
  },
  {
    id: '2',
    content: `Nice to see you guys!`,
    author: 'YingLong Ma',
  },
  {
    id: '3',
    content: `Goodbye, world!`,
    author: 'YingLong Ma',
  },
  {
    id: '4',
    content: `你好，马应龙。我是马杰克`,
    author: 'Jack Ma',
  },
  {
    id: '5',
    content: `Holy shit`,
    author: 'John Smith',
  },
  {
    id: '6',
    content: `Goodbye, world!`,
    author: 'YingLong Ma',
  },
  {
    id: '7',
    content: `Goodbye, world!`,
    author: 'John Smith',
  },
  {
    id: '8',
    content: `Goodbye, world!`,
    author: 'Jack Ma',
  },
]

const UserPanel: React.FC<Props> = (props) => {
  const [api, contextHolder] = notification.useNotification()

  const roomParticipants = useSelector(selectRoomParticipants)
  const { username } = useSelector(selectUserInfo)

  const [messages, setMessages] = useState<Message[]>(msgs)
  const [msgContent, setMsgContent] = useState<string>('')
  const [currMsg, setCurrMsg] = useState<Message>({
    id: '',
    author: username,
    content: '',
  })
  const [noticeFlag, setNoticeFlag] = useState<string>('')

  const scrollRef = useMsgScrollToView(messages)

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target) setMsgContent(e.target.value)
  }

  const debounceContent = useDebounceValue(msgContent)

  useEffect(() => {
    if (debounceContent) {
      setCurrMsg({
        ...currMsg,
        id: crypto.randomUUID(),
        content: debounceContent,
      })
    }
  }, [debounceContent])

  const handleSendMessage = () => {
    if (msgContent === '') {
      setNoticeFlag(crypto.randomUUID())
      return
    }

    setNoticeFlag('')
    console.log('Send', currMsg)

    setMessages((m) => [...m, currMsg])
    setCurrMsg({
      id: '',
      author: username,
      content: '',
    })
    setMsgContent('')
  }

  useEffect(() => {
    if (noticeFlag !== '') {
      api.warning({
        message: '不能发送空白信息',
        placement: 'bottomLeft',
      })
    }
  }, [noticeFlag])

  return (
    <div className="sm:w-60 md:w-80 h-a shrink-0 p-2 flex flex-col gap-y-0.5 justify-between">
      {contextHolder}
      <div id="participants" h-60>
        {roomParticipants
          ? roomParticipants.map((user) => {
              return (
                <div
                  key={user.id}
                  className="text-gray my-1 px-2 py-1 hover:bg-op-20 hover:bg-gray hover:rd-2"
                >
                  <div font-bold>{user.username}</div>
                  <div>{user.socketId}</div>
                </div>
              )
            })
          : null}
      </div>
      <div
        id="resizeBar"
        w-full
        h="2.4"
        hover:bg-dark-50
        transition-100
        bg-op-20
        cursor-ns-resize
        py="0.25"
        grid
        place-items-center
        before="content-empty w-4 h-0.2 bg-white"
        after="content-empty w-4 h-0.2 bg-white"
      ></div>
      <div id="messageBox" flex-1 flex flex-col bg-slate-400 bg-op-20 rd-2>
        <div h-90 max-h-180 flex flex-col p-1 overflow-y-scroll rd-2>
          {messages.map((msg, index) => {
            const sameAuthor =
              index > 0 && msg.author === messages[index - 1].author
            return <MessageBox key={msg.id} message={{ ...msg, sameAuthor }} />
          })}
          <div ref={scrollRef}></div>
        </div>
        <div relative flex-1 rd-2>
          <textarea
            rows={4}
            placeholder="在这里输入消息..."
            value={msgContent}
            onChange={handleTextAreaChange}
            className={`
              block absolute bottom-0 resize-none p-2.5 w-full h-full
              text-sm text-gray-900 bg-gray-100 bg-op-90 rounded-lg
              border border-gray-400
              focus:ring-blue-500 focus:border-blue-500
              dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
              dark:focus:ring-blue-500 dark:focus:border-blue-500
            `}
          />
          <IconBox
            className="absolute bottom-2 right-1"
            icon={<div i-mdi-send rotate--30 />}
            handleClick={handleSendMessage}
          />
        </div>
      </div>
    </div>
  )
}

export default UserPanel
