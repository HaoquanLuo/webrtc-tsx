import React from 'react'

const ShadowBox: React.FC<{ children: React.ReactElement }> = (props) => {
  const { children } = props

  return (
    <div p-2 w-full h-full flex>
      <div relative p-2 shadow-inner shadow-md rd-2 w-full h-full>
        {children}
      </div>
    </div>
  )
}

export default ShadowBox
