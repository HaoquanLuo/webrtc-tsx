import { useLoadStream } from '@/hooks/useLoadStream'
import * as React from 'react'
import LoadingBox from './LoadingBox'
import MediaBox from './MediaBox'

interface Props {
  key?: string | number | symbol
  withAudioOnly: boolean
  getStreamFunction: () => Promise<MediaStream>
  username: string
}

const CameraBox: React.FC<Props> = (props) => {
  const { withAudioOnly, getStreamFunction, username } = props
  const { localStream, streamStatus } = useLoadStream(getStreamFunction)

  return (
    <div grid place-items-center>
      {streamStatus === 'loading' && <LoadingBox />}
      {streamStatus === 'complete' && (
        <MediaBox
          audioOnly={withAudioOnly}
          srcObject={localStream!}
          userName={username}
        />
      )}
    </div>
  )
}

export default CameraBox
