import React from 'react'

const ShadowBox: React.FC<{ children: React.ReactElement }> = (props) => {
  const { children } = props
  return (
    <div shadow-xl rd-2 m-3 p-2 b-2 flex-1>
      {children}
    </div>
  )
}

const UserLayout: React.FC<{ children: React.ReactElement }> = (props) => {
  const { children } = props

  return (
    <div flex-1 flex>
      <div bg-yellow w-60 h-full></div>
      <ShadowBox>{children}</ShadowBox>
    </div>
  )
}

export default UserLayout
