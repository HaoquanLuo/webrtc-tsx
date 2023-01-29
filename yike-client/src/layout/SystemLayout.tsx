import React from 'react'
import SystemHeader from './SystemHeader'

interface Props {
  children: React.ReactNode
}

const SystemLayout: React.FC<Props> = (props) => {
  const { children } = props
  return (
    <div
      id="system-layout"
      flex
      flex-col
      w-full
      h-full
      relative
      bg-blend-soft-light
    >
      <SystemHeader />
      {children}
    </div>
  )
}

export default React.memo(SystemLayout)
