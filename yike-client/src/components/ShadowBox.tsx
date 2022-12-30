import * as React from 'react'
import ActionBox from './ActionBox'

const ShadowBox: React.FC<{ children: React.ReactElement }> = (props) => {
  const { children } = props
  return (
    <div p-4 drop-shadow-xl w-full h-full flex>
      <div relative p-2 shadow-xl rd-2 b-op-50 w-full h-full>
        {children}
        <ActionBox />
      </div>
    </div>
  )
}

export default ShadowBox
