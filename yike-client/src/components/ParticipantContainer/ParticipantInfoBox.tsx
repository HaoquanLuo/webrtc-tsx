import { useDispatch, useSelector } from 'react-redux'
import IconBox from '../IconBox'
import {
  selectChatSectionStore,
  selectCurrChatTargetTitle,
  selectUserInfo,
  setChatSectionStore,
  setCurrChatTargetTitle,
} from '@/redux/features/user/userSlice'
import { SIO } from '@/common/typings/socket'

interface ParticipantInfoBoxProps {
  user: SIO.User
}

const ParticipantInfoBox: React.FC<ParticipantInfoBoxProps> = (props) => {
  const { user } = props

  const dispatch = useDispatch()

  const { username } = useSelector(selectUserInfo)
  const currChatTargetTitle = useSelector(selectCurrChatTargetTitle)
  const chatSectionStore = useSelector(selectChatSectionStore)

  const handleSwitchChatTarget = (user: SIO.User) => {
    const { socketId, username } = user

    function dispatchSetCurrChatTitleAction() {
      return new Promise<string>((resolve, reject) => {
        // 先检查当前的聊天目标是否为对方
        if (currChatTargetTitle === username) {
          reject(`Already chatting with '${username}'`)
        } else {
          dispatch(setCurrChatTargetTitle(user.username))
          resolve(`Switch 'currChatTarget' to ${username}`)
        }
      })
    }

    try {
      ;(async () => {
        if (chatSectionStore[username] === undefined) {
          dispatch(
            setChatSectionStore({
              ...chatSectionStore,
              [username]: {
                chatId: socketId,
                chatTitle: username,
                chatMessages: [],
              },
            }),
          )
        }

        await dispatchSetCurrChatTitleAction()
      })()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div
      key={user.username}
      className="relative flex flex-col text-gray my-1 px-2 py-1 transition-100 rd-2"
      hover="bg-op-20 bg-gray rd-2"
    >
      <div font-bold>{user.username}</div>
      <div>{user.socketId}</div>
      {username !== user.username && (
        <IconBox
          absolute
          top-3
          right-3
          icon={<div i-mdi-message-outline />}
          handleClick={() => handleSwitchChatTarget(user)}
        />
      )}
    </div>
  )
}

export default ParticipantInfoBox
