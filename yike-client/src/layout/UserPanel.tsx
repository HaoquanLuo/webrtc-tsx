import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  selectRoomParticipants,
  selectRoomStatus,
} from '@/redux/features/system/systemSlice'
import IconBox from '@/components/IconBox'
import {
  selectPublicMessages,
  selectUserInfo,
  selectUserSocketId,
} from '@/redux/features/user/userSlice'
import { useDebounceValue } from '@/hooks/useDebounce'
import { notification } from 'antd'
import { WebRTCHandler } from '@/core/webRTCHandler'
import { getItem, setItem } from '@/common/utils/storage'
import MessageContainer from '@/components/MessageContainer/MessageContainer'
import ParticipantContainer from '@/components/ParticipantContainer/ParticipantContainer'

interface Props {}

const UserPanel: React.FC<Props> = (props) => {
  const [api, contextHolder] = notification.useNotification()

  const roomParticipants = useSelector(selectRoomParticipants)
  const roomStatus = useSelector(selectRoomStatus)
  const { username } = useSelector(selectUserInfo)
  const userSocketId = useSelector(selectUserSocketId)
  const publicMessages = useSelector(selectPublicMessages)

  const [msgContent, setMsgContent] = useState<string>('')
  const [currMsg, setCurrMsg] = useState<User.PublicMessage>({
    id: '',
    author: username,
    authorId: '',
    content: '',
  })
  const [noticeFlag, setNoticeFlag] = useState<string>('')
  const [togglerY, setTogglerY] = useState<string>(
    (getItem('msgBoxHeight') as string) || '488',
  )
  const [startPageY, setStartPageY] = useState<number>(488)
  const [isToggling, setIsToggling] = useState<boolean>(false)
  const [contactList, setContactList] = useState<string[]>(['聊天室', 'test0'])
  const [currContactTarget, setCurrContactTarget] = useState<string>('聊天室')

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
    if (!e.shiftKey && e.key === 'Enter') {
      e.preventDefault()
      console.log('Enter')
      setTimeout(() => {
        handleSendMessage()
      }, 150)
    } else if (e.repeat && e.shiftKey) {
      console.log('Change line')
    }
  }

  // 发送消息事件
  const handleSendMessage = () => {
    const allowStrReg = /^((\s*)(\S+)(\s*))$/gm
    const allowStrFlag = allowStrReg.test(debounceContent)

    // 判断要发送的文本是否为空
    if (!allowStrFlag) {
      setNoticeFlag(crypto.randomUUID())
      return
    }

    setNoticeFlag('')
    console.log('Send', currMsg)

    WebRTCHandler.sendMessageUsingDataChannel(currMsg)

    setCurrMsg({
      id: '',
      author: username,
      authorId: userSocketId,
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
    setCurrMsg({
      ...currMsg,
      id: crypto.randomUUID(),
      content: debounceContent,
    })
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
      className='
        relative
        sm:w-60
        lg:w-80
        h-a
        shrink-0
        p-2
        flex
        flex-col
        gap-y="0.5"
        justify-between
      '
    >
      {contextHolder}
      {/* {roomStatus === 'existed' || roomStatus === 'created' ? ( */}
      <>
        <div
          id="participants"
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
          <ParticipantContainer participants={roomParticipants} />
        </div>
        <div
          id="toggler"
          style={{
            bottom: parseInt(MsgBoxHeight, 10) + 8,
          }}
          className={`
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
          `}
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
          id="messageBox"
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
          <div
            absolute
            w-full
            flex
            px-2
            gap-x-2
            items-center
            h="15.5"
            bg-dark
            bg-op-40
          >
            {contactList.map((contactTarget) => {
              return (
                <div
                  key={contactTarget}
                  className={`grid place-items-center rd-36 ${
                    currContactTarget === contactTarget
                      ? 'bg-orange ring-light-4 ring-2'
                      : 'bg-gray'
                  } w-12 h-12 text-xs`}
                  onClick={() => {
                    setCurrContactTarget(contactTarget)
                  }}
                >
                  {contactTarget}
                </div>
              )
            })}
          </div>
          <MessageContainer messages={publicMessages} />
          <div relative h-26 rd-2>
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
                  bg-gray-300
                  bg-op-90
                  rd-2
                  border
                  order-gray-400
                  focus:ring-blue-500 focus:border-blue-500
                  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                  dark:focus:ring-blue-500 dark:focus:border-blue-500
                "
              value={msgContent}
              onChange={handleTextAreaChange}
              onKeyDown={handleTextAreaDown}
              placeholder={`'Shift + Enter' 换行`}
            />
            <IconBox
              className="absolute bottom-2 right-2"
              icon={<div i-mdi-send rotate--30 />}
              handleClick={handleSendMessage}
            />
          </div>
        </div>
      </>
      {/* ) : null} */}
    </div>
  )
}

export default UserPanel
