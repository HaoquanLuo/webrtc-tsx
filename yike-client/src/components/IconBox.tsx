import React from 'react'

interface Props extends React.HtmlHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactElement
  handleClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const IconBox: React.FC<Props> = (props) => {
  const { icon, handleClick, ...rest } = props
  return (
    <button
      w-8
      h-8
      b-1
      b-gray
      b-op-40
      bg-white
      rd-36
      grid
      place-items-center
      text-black
      text-xl
      cursor-pointer
      hover:text-blue
      hover:b-blue
      transition-250
      onClick={(e) => handleClick && handleClick(e)}
      {...rest}
    >
      {icon}
    </button>
  )
}

export default IconBox
