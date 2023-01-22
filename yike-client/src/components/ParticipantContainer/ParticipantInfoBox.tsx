import { useSelector } from 'react-redux'
import { SIO } from '../../../../socket'
import IconBox from '../IconBox'
import {
  selectCurrChatTargetId,
  selectUserInfo,
} from '@/redux/features/user/userSlice'

interface ParticipantInfoBoxProps {
  user: SIO.User
}

const ParticipantInfoBox: React.FC<ParticipantInfoBoxProps> = (props) => {
  const { user } = props

  const { username } = useSelector(selectUserInfo)

  const handleSwitchChatTarget = (socketId: string) => {
    // 先检查当前的聊天目标是否
    const currChatTargetId = useSelector(selectCurrChatTargetId)
    if (currChatTargetId === socketId) {
      console.log(`Already in chatting with '${socketId}'`)
    }
    console.log('Chat target switch to', socketId)
  }

  return (
    <div
      key={user.socketId}
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
          handleClick={() => handleSwitchChatTarget(user.socketId)}
        />
      )}
    </div>
  )
}

export default ParticipantInfoBox
