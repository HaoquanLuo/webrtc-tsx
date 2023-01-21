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
import { getItem, setItem } from '@/common/utils/storage'

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
  const [togglerY, setTogglerY] = useState<string>(
    (getItem('msgBoxHeight') as string) || '488',
  )
  const [startPageY, setStartPageY] = useState<number>(488)
  const [isToggling, setIsToggling] = useState<boolean>(false)

  const scrollRef = useMsgScrollToView(messages)

  const debounceContent = useDebounceValue(msgContent)

  const calcTogglerY = (value: string) => {
    const numTogglerY = parseInt(value, 10)
    if (numTogglerY > 480) {
      return 480
    } else if (numTogglerY < 166) {
      return 166
    } else {
      return numTogglerY
    }
  }

  const MsgBoxHeight = `${calcTogglerY(togglerY)}px`

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

  // 发送消息事件
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

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsToggling(true)
    setStartPageY(event.pageY)
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isToggling) {
      return
    }

    const numTogglerY = parseInt(togglerY, 10)
    const delta = event.pageY - startPageY
    const currTogglerY = numTogglerY - delta

    setTogglerY(`${currTogglerY}`)
    setStartPageY(event.pageY)
  }

  const handleMouseUp = () => {
    setIsToggling(false)
    setItem('msgBoxHeight', togglerY)
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
      relative
      md:w-60
      lg:w-80
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
          <div
            style={{
              bottom: parseInt(MsgBoxHeight, 10) + 16,
            }}
            absolute
            top-2
            left-2
            right-2
            overflow-y-scroll
            rd-2
          >
            {roomParticipants
              ? roomParticipants.map((user) => {
                  return (
                    <div
                      key={user.id}
                      className="text-gray my-1 px-2 py-1 transition-100 rd-2"
                      hover="bg-op-20 bg-gray rd-2"
                    >
                      <div font-bold>{user.username}</div>
                      <div>{user.socketId}</div>
                    </div>
                  )
                })
              : null}
          </div>
          <div
            className="
              absolute
              left-0
              right-0
              z-9
              w-full
              h-3
              bg-op-20
              cursor-ns-resize
              py-0.5
              grid
              place-items-center
              transition-100
            "
            style={{
              bottom: parseInt(MsgBoxHeight, 10) + 8,
            }}
            onMouseDown={handleMouseDown}
            hover="bg-black bg-op-20 before:bg-light after:bg-light"
            before="content-empty w-4 h-0.2 bg-gray"
            after="content-empty w-4 h-0.2 bg-gray"
          >
            {isToggling && (
              <div
                fixed
                top-0
                bottom-0
                left-0
                right-0
                cursor-ns-resize
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              ></div>
            )}
          </div>
          <div
            style={{
              height: MsgBoxHeight,
            }}
            absolute
            bottom-2
            left-2
            right-2
            max-h-200
            min-h-40
            flex
            flex-col
            bg-slate-400
            bg-op-20
            rd-2
          >
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
                className="
                  block
                  absolute
                  bottom-0
                  resize-none
                  p-2
                  w-full
                  h-full
                  text-sm
                  text-gray-900
                  bg-gray-100
                  bg-op-90
                  rounded-lg
                  border
                  order-gray-400
                  focus:ring-blue-500 focus:border-blue-500
                  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                  dark:focus:ring-blue-500 dark:focus:border-blue-500
                "
                value={msgContent}
                onChange={handleTextAreaChange}
                onKeyDown={handleTextAreaDown}
                placeholder="在这里输入消息..."
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
