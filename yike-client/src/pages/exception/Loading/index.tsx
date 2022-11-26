import React from 'react'

const LoadingPage: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: -1,
        left: -1,
        width: '99vw',
        height: '99vh',
        background: 'rgba(254,255,255, 0.08)',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <h1>Loading...</h1>
      {/* <div className="animate-spin circle"></div> */}
    </div>
  )
}

export default LoadingPage
