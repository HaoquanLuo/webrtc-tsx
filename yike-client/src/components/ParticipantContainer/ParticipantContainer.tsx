import { SIO } from '@/common/typings/socket'
import ParticipantInfoBox from './ParticipantInfoBox'

interface ParticipantContainerProps {
  participants: SIO.User[]
}

const ParticipantContainer: React.FC<ParticipantContainerProps> = (props) => {
  const { participants } = props
  return (
    <>
      {participants
        ? participants.map((user) => {
            return <ParticipantInfoBox key={user.socketId} user={user} />
          })
        : null}
    </>
  )
}

export default ParticipantContainer
