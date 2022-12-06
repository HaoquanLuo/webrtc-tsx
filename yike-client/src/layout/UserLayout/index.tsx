import React from 'react'

const ShadowBox: React.FC<{ children: React.ReactElement }> = (props) => {
  const { children } = props
  return (
    <div p-3 drop-shadow-xl w-full h-full flex>
      <div shadow-xl rd-2 b-op-50 w-full h-full>
        {children}
      </div>
    </div>
  )
}

const UserLayout: React.FC<{ children: React.ReactElement }> = (props) => {
  const { children } = props

  return (
    <div id="user-layout" flex-1 flex>
      <div bg-yellow min-w="60!" h-a shrink-0></div>
      <ShadowBox>{children}</ShadowBox>
    </div>
  )
}

export default UserLayout
