import React from 'react'

interface Props {
  icon?: React.ReactElement
  handleClick?: (event?: MouseEvent) => void
}

const IconBox: React.FC<Props> = (props) => {
  const { icon, handleClick } = props
  return (
    <div
      w-8
      h-8
      b-1
      b-gray
      b-op-60
      rd-36
      grid
      place-items-center
      text-xl
      cursor-pointer
      hover:text-blue
      hover:b-blue
      transition-200
      onClick={() => handleClick && handleClick()}
    >
      {icon}
    </div>
  )
}

export default IconBox
