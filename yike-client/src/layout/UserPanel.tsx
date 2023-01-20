import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  selectRoomParticipants,
  selectRoomStatus,
} from '@/redux/features/system/systemSlice'
import IconBox from '@/components/IconBox'
import MessageBox from '@/components/MessageBox'
import { useMsgScrollToView } from '@/hooks/useScrollToView'
import { selectMessages, selectUserInfo } from '@/redux/features/user/userSlice'
import { useDebounceValue } from '@/hooks/useDebounce'
import { notification } from 'antd'
import { WebRTCHandler } from '@/core/webRTCHandler'

interface Props {}

const UserPanel: React.FC<Props> = (props) => {
  const [api, contextHolder] = notification.useNotification()

  const roomParticipants = useSelector(selectRoomParticipants)
  const roomStatus = useSelector(selectRoomStatus)
  const { username } = useSelector(selectUserInfo)
  const messages = useSelector(selectMessages)

  const [msgContent, setMsgContent] = useState<string>('')
  const [currMsg, setCurrMsg] = useState<User.Message>({
    id: '',
    author: username,
    content: '',
    createdByMe: true,
  })
  const [noticeFlag, setNoticeFlag] = useState<string>('')

  const scrollRef = useMsgScrollToView(messages)

  const debounceContent = useDebounceValue(msgContent)

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMsgContent(e.target.value)
  }

  const handleTextAreaDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      console.log('Enter')
    }
    if (e.key === 'Control') {
      console.log('Control')
    }
    if (e.repeat) {
      console.log('repeating', e.key)
    }
  }

  const handleSendMessage = () => {
    if (msgContent === '') {
      setNoticeFlag(crypto.randomUUID())
      return
    }

    setNoticeFlag('')
    console.log('Send', currMsg)

    WebRTCHandler.sendMessageUsingDataChannel(currMsg)

    setCurrMsg({
      ...currMsg,
      id: '',
      author: username,
      content: '',
    })
    setMsgContent('')
  }

  useEffect(() => {
    if (debounceContent) {
      setCurrMsg({
        ...currMsg,
        id: crypto.randomUUID(),
        content: debounceContent,
      })
    }
  }, [debounceContent])

  useEffect(() => {
    if (noticeFlag !== '') {
      api.warning({
        message: '不能发送空白信息',
        placement: 'bottomLeft',
      })
    }
  }, [noticeFlag])

  return (
    <div
      md:w-60
      xl:w-80
      h-a
      shrink-0
      p-2
      flex
      flex-col
      gap-y="0.5"
      justify-between
    >
      {contextHolder}
      {roomStatus === 'existed' || roomStatus === 'created' ? (
        <>
          <div id="participants" flex-1>
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
            hover="bg-dark-50 before:bg-light after:bg-light"
            transition-100
            bg-op-20
            cursor-ns-resize
            py="0.25"
            grid
            place-items-center
            before="content-empty w-4 h-0.2 bg-gray"
            after="content-empty w-4 h-0.2 bg-gray"
          />
          <div id="messageBox" h-120 flex flex-col bg-slate-400 bg-op-20 rd-2>
            <div flex-1 flex flex-col p-1 overflow-y-scroll rd-2>
              {messages.map((msg, index) => {
                const sameAuthor =
                  index > 0 && msg.author === messages[index - 1].author
                return (
                  <MessageBox key={msg.id} message={{ ...msg, sameAuthor }} />
                )
              })}
              <div ref={scrollRef}></div>
            </div>
            <div relative h-24 rd-2>
              <textarea
                rows={4}
                placeholder="在这里输入消息..."
                value={msgContent}
                onChange={handleTextAreaChange}
                onKeyDown={handleTextAreaDown}
                className={`block absolute bottom-0 resize-none p-2 w-full h-full text-sm text-gray-900 bg-gray-100 bg-op-90 rounded-lg border border-gray-400`}
              />
              <IconBox
                className="absolute bottom-2 right-1"
                icon={<div i-mdi-send rotate--30 />}
                handleClick={handleSendMessage}
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default UserPanel
