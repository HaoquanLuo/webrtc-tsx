import React from 'react'

const LoadingPage: React.FC = () => {
  return (
    <div
      fixed
      top-0
      bottom-0
      left-0
      right-0
      w-full
      h-full
      grid
      place-items-center
      text-center
    >
      <div text-center animate-spin i-mdi-loading text-9xl></div>
    </div>
  )
}

export default LoadingPage
