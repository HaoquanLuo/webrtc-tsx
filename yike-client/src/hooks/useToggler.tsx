import { getItem, setItem } from '@/common/utils/storage'
import React from 'react'
import { useMemo, useState } from 'react'

export const useToggler = () => {
  const [togglerY, setTogglerY] = useState<number>(
    parseInt(getItem('msgBoxHeight') as string, 10) || 488,
  )
  const [startPageY, setStartPageY] = useState<number>(
    parseInt(getItem('msgBoxHeight') as string, 10) || 488,
  )
  const [isToggling, setIsToggling] = useState<boolean>(false)

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsToggling(true)
    setStartPageY(event.pageY)
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isToggling) {
      return
    }

    const delta = event.pageY - startPageY
    const currTogglerY = togglerY - delta

    setTogglerY(currTogglerY)
    setStartPageY(event.pageY)
  }

  const handleMouseUp = () => {
    setIsToggling(false)
    setItem('msgBoxHeight', togglerY)
  }

  const calcTogglerY = (value: number) => {
    if (value > 480) {
      return 480
    } else if (value < 166) {
      return 166
    } else {
      return value
    }
  }

  const msgBoxHeight = `${calcTogglerY(togglerY)}px`

  const togglerStyle = useMemo(
    () => ({
      bottom: parseInt(msgBoxHeight, 10) + 8,
    }),
    [msgBoxHeight],
  )

  const Toggler = React.memo(() => (
    <div
      id="toggler"
      style={togglerStyle}
      className="
        absolute
        left-0
        right-0
        z-9
        w-full
        h-3
        bg-op-20
        cursor-ns-resize
        py-0.5
        grid
        place-items-center
        transition-100
      "
      onMouseDown={handleMouseDown}
      before="content-empty w-4 h-0.2 bg-gray"
      after="content-empty w-4 h-0.2 bg-gray"
    >
      {isToggling && (
        <div
          className="
            fixed
            top-0
            bottom-0
            left-0
            right-0
            cursor-ns-resize
          "
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      )}
    </div>
  ))

  return [msgBoxHeight, Toggler] as const
}
