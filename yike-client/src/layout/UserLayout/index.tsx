import React from 'react'

const UserLayout: React.FC<{ children: React.ReactElement }> = (props) => {
  const { children } = props
  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          background: '#999666',
          width: '100%',
          height: '2rem',
        }}
      >
        Header
      </div>
      {children}
    </>
  )
}

export default UserLayout
