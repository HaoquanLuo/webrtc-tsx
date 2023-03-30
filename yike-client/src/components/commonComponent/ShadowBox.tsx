import React from 'react'

interface ShadowBoxProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  open?: boolean
}

const ShadowBox: React.FC<ShadowBoxProps> = (props) => {
  const { children, open = false, ...rest } = props

  return (
    <div p-2 w-full h-full flex>
      <div
        className={`relative p-2 rd-2 w-full h-full ${
          open && 'shadow-[0_0_2px_rgba(0,0,0,0.2)]'
        } `}
      >
        {children}
      </div>
    </div>
  )
}

export default ShadowBox
