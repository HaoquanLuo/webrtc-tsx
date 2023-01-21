import { useSelector } from 'react-redux'
import { SIO } from '../../../../socket'
import IconBox from '../IconBox'
import { selectUserInfo } from '@/redux/features/user/userSlice'

interface ParticipantInfoBoxProps {
  userInfo: SIO.User
}

const ParticipantInfoBox: React.FC<ParticipantInfoBoxProps> = (props) => {
  const { userInfo } = props

  const { username } = useSelector(selectUserInfo)

  const handleDirectMessage = (socketId: string) => {
    console.log('Direct Message', socketId)
  }

  return (
    <div
      key={userInfo.socketId}
      className="relative flex flex-col text-gray my-1 px-2 py-1 transition-100 rd-2"
      hover="bg-op-20 bg-gray rd-2"
    >
      <div font-bold>{userInfo.username}</div>
      <div>{userInfo.socketId}</div>
      {username !== userInfo.username && (
        <IconBox
          absolute
          top-3
          right-3
          icon={<div i-mdi-message-outline />}
          handleClick={() => handleDirectMessage(userInfo.socketId)}
        />
      )}
    </div>
  )
}

export default ParticipantInfoBox
