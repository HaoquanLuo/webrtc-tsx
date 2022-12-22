import React from 'react'
import SystemHeader from './SystemHeader'

interface Props {
  children: React.ReactElement
}

const SystemLayout: React.FC<Props> = (props) => {
  const { children } = props
  return (
    <div id="system-layout" flex flex-col w-full h-full relative>
      <SystemHeader />
      {children}
    </div>
  )
}

export default SystemLayout
