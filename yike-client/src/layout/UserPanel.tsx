import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectRoomId,
  selectRoomParticipants,
  selectRoomStatus,
} from '@/redux/features/system/systemSlice'
import IconBox from '@/components/IconBox'
import {
  selectCurrChatTargetTitle as selectCurrChatTargetTitle,
  selectChatSectionStore as selectChatSectionStore,
  selectPublicMessages,
  selectUserInfo,
  selectUserSocketId,
  setCurrChatTargetTitle,
  setChatSectionStore,
} from '@/redux/features/user/userSlice'
import { useDebounceValue } from '@/hooks/useDebounce'
import { notification } from 'antd'
import { WebRTCHandler } from '@/core/webRTCHandler'
import MessageContainer from '@/components/MessageContainer/MessageContainer'
import ParticipantContainer from '@/components/ParticipantContainer/ParticipantContainer'
import { SocketClient } from '@/core/SocketClientEventHandler'
import { useToggler } from '@/hooks/useToggler'
import { PublicChatTitle } from '@/common/constants/chat'
import { SIO } from '@/common/typings/socket'

type ChatHistory<T> = (nextChatList: T[], chatTarget: T) => T[]

interface Props {}

const UserPanel: React.FC<Props> = (props) => {
  const dispatch = useDispatch()
  const [api, contextHolder] = notification.useNotification()

  const roomId = useSelector(selectRoomId)
  const roomParticipants = useSelector(selectRoomParticipants)
  const roomStatus = useSelector(selectRoomStatus)
  const { username } = useSelector(selectUserInfo)
  const userSocketId = useSelector(selectUserSocketId)
  const publicMessages = useSelector(selectPublicMessages)
  const chatSectionStore = useSelector(selectChatSectionStore)
  const currChatTargetTitle = useSelector(selectCurrChatTargetTitle)

  const [msgContent, setMsgContent] = useState<string>('')
  const [currMsg, setCurrMsg] = useState<SIO.Message>(() => ({
    id: '',
    senderName: username,
    senderSocketId: userSocketId,
    receiverName: '',
    receiverSocketId: '',
    messageContent: '',
  }))
  const [noticeFlag, setNoticeFlag] = useState<string>('')

  const debounceContent = useDebounceValue(msgContent)
  const [msgBoxHeight, Toggler] = useToggler()

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMsgContent(e.target.value)
  }

  const handleTextAreaDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!e.shiftKey && e.key === 'Enter') {
      e.preventDefault()

      setTimeout(() => {
        handleSendMessage()
      }, 150)
    }
  }

  // 发送消息事件
  const handleSendMessage = () => {
    function messageValidator(value: string) {
      return new Promise<void>((resolve, reject) => {
        const allowStrReg = /^((\s*)(\S+)(\s*))$/gm
        const allowStrFlag = allowStrReg.test(value)

        // 判断要发送的文本是否为空
        if (!allowStrFlag) {
          setNoticeFlag(crypto.randomUUID())
          reject()
        }

        setNoticeFlag('')
        resolve()
      })
    }

    function sendMessage(message: SIO.Message) {
      if (currChatTargetTitle === `${PublicChatTitle}_${roomId}`) {
        WebRTCHandler.sendMessageUsingDataChannel(message)
      } else {
        SocketClient.handleSendDirectMessage(message)
      }
    }

    ;(async () => {
      try {
        await messageValidator(debounceContent)
        setTimeout(() => {
          sendMessage(currMsg)
        }, 150)
      } catch (error) {
        console.error(error)
      } finally {
        setCurrMsg({
          ...currMsg,
          id: '',
          messageContent: '',
        })
        setMsgContent('')
      }
    })()
  }

  const handleSetCurrChatTargetTitle = (chatTargetTitle: string) => {
    if (!(currChatTargetTitle === chatTargetTitle)) {
      dispatch(setCurrChatTargetTitle(chatTargetTitle))
    }
  }
  const participantsStyle = useMemo(
    () => ({
      bottom: parseInt(msgBoxHeight, 10) + 16,
    }),
    [msgBoxHeight],
  )

  const messageBoxStyle = useMemo(
    () => ({
      height: msgBoxHeight,
    }),
    [msgBoxHeight],
  )

  let chatList = useMemo(() => {
    const handleSelectChatHistory: ChatHistory<
      [string, User.ChatSectionStructure]
    > = (nextChatList, chatTarget) => {
      const [chatTitle, _chatSectionStructure] = chatTarget
      const roomFlag = chatTitle.includes(`${PublicChatTitle}`)
      const thisRoomFlag = chatTitle.includes(`${roomId}`)

      if (!roomFlag) {
        nextChatList = [...nextChatList, chatTarget]
      }

      if (roomFlag && thisRoomFlag) {
        nextChatList = [chatTarget, ...nextChatList]
      }

      return nextChatList
    }

    return Object.entries(chatSectionStore).reduce(handleSelectChatHistory, [])
  }, [Object.entries(chatSectionStore).length])

  useEffect(() => {
    if (roomStatus !== 'existed') {
      return
    }

    if (currChatTargetTitle === '') {
      // 初始化 currMsg
      setCurrMsg({
        ...currMsg,
        senderName: username,
        senderSocketId: userSocketId,
      })

      return
    }

    if (currChatTargetTitle === `${PublicChatTitle}_${roomId}`) {
      // 发送消息到聊天室
      setCurrMsg({
        ...currMsg,
        id: crypto.randomUUID(),
        senderSocketId: userSocketId,
        receiverName: '',
        receiverSocketId: '',
        messageContent: debounceContent,
      })
    } else {
      // 发送消息到指定用户
      const [chatTarget] = Object.entries(chatSectionStore).filter(
        ([chatId]) => chatId === currChatTargetTitle,
      )
      const [_currChatTitle, currChatSectionStructure] = chatTarget

      setCurrMsg({
        ...currMsg,
        id: crypto.randomUUID(),
        senderSocketId: userSocketId,
        receiverName: currChatSectionStructure.chatTitle,
        receiverSocketId: currChatSectionStructure.chatId,
        messageContent: debounceContent,
      })
    }
  }, [userSocketId, roomStatus, debounceContent, currChatTargetTitle])

  useEffect(() => {
    if (roomStatus !== 'existed') {
      return
    }

    if (publicMessages.length > 0) {
      dispatch(
        setChatSectionStore({
          ...chatSectionStore,
          [`${PublicChatTitle}_${roomId}`]: {
            ...chatSectionStore[`${PublicChatTitle}_${roomId}`],
            chatMessages: publicMessages,
          },
        }),
      )
    }

    return () => {
      chatList = []
    }
  }, [roomStatus, publicMessages])

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
      {roomStatus === 'existed' || roomStatus === 'created' ? (
        <>
          <div
            id="participants"
            style={participantsStyle}
            className="
              absolute
              top-2
              left-2
              right-2
              overflow-y-scroll
              rd-2
            "
          >
            <ParticipantContainer participants={roomParticipants} />
          </div>
          <Toggler />
          <div
            id="messageBox"
            style={messageBoxStyle}
            className="
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
            "
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
              bg-op-30
              rd-t-2
            >
              {chatList.map(([chatTitle, chatSectionStructure]) => {
                return (
                  <div
                    key={chatTitle}
                    className={`grid place-items-center rd-36 ${
                      currChatTargetTitle === chatTitle
                        ? 'bg-orange ring-light-4 ring-2'
                        : 'bg-gray-3'
                    } w-11 h-11 text-xs cursor-pointer`}
                    onClick={() => handleSetCurrChatTargetTitle(chatTitle)}
                  >
                    {chatSectionStructure.chatTitle}
                  </div>
                )
              })}
            </div>
            <MessageContainer
              messages={chatSectionStore[currChatTargetTitle]?.chatMessages}
            />
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
      ) : null}
    </div>
  )
}

export default UserPanel
