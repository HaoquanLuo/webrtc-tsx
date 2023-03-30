import React from 'react'

interface Props extends React.HtmlHTMLAttributes<HTMLDivElement> {}

const LoadingBox: React.FC<Props> = () => {
  return <div text-center animate-spin i-mdi-loading text-9xl></div>
}

export default LoadingBox
