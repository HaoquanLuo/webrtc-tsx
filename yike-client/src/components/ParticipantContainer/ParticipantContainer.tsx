import { SIO } from '../../../../socket'
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
            return <ParticipantInfoBox key={user.socketId} userInfo={user} />
          })
        : null}
    </>
  )
}

export default ParticipantContainer
