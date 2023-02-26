import React from 'react'
import type { IconBoxProps, IconSize } from './IconBox'

const iconSize = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
  xl: 'w-12 h-12',
}

interface Props extends React.HtmlHTMLAttributes<HTMLDivElement> {
  Icon:
    | React.ReactElement<IconBoxProps>
    | ((props: IconBoxProps) => React.ReactElement<IconBoxProps>)
  size?: keyof IconSize
  handleClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const IconContainer: React.FC<Props> = (props) => {
  const { Icon, size = 'md', handleClick, ...rest } = props

  return (
    <div
      className={`
        b-1 b-white b-op-20 bg-white rd-36 text-dark text-xl
        grid place-items-center cursor-pointer
        hover:text-violet-5 hover:b-violet-6
        dark:text-white dark:bg-#232323 dark:b-dark dark:rd-36
        dark:hover:b-violet-6 dark:hover:text-violet-5
        ${iconSize[size]}
      `}
      onClick={(e) => handleClick?.(e)}
      {...rest}
    >
      {typeof Icon === 'function' ? <Icon iconSize={size} /> : Icon}
    </div>
  )
}

export default IconContainer
