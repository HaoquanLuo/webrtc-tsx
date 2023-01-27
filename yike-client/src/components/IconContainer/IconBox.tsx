import React from 'react'

export type IconSize = {
  sm: 'w-6 h-6'
  md: 'w-8 h-8'
  lg: 'w-10 h-10'
  xl: 'w-12 h-12'
}

export interface IconBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  iconSize?: keyof IconSize
  iconName?: string
}

const IconBox: React.FC<IconBoxProps> = (props) => {
  const { iconName, iconSize = 'md', ...rest } = props

  return <i className={`${iconName} ${iconSize}`} {...rest}></i>
}

export default IconBox
