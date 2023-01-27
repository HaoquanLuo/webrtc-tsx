import { getItem, setItem } from '@/common/utils/storage'
import React, { useEffect } from 'react'
import { useMemo, useState } from 'react'

export const useToggler = () => {
  const [togglerY, setTogglerY] = useState<number>(
    parseInt(getItem('msgBoxHeight') as string, 10) || 488,
  )
  const [startPageY, setStartPageY] = useState<number>(
    parseInt(getItem('msgBoxHeight') as string, 10) || 488,
  )
  const [isToggling, setIsToggling] = useState<boolean>(false)
  const [msgBoxHeight, setMsgBoxHeight] = useState<number>(480)

  const calcTogglerY = (value: number) => {
    if (value > 488) {
      return 488
    } else if (value < 168) {
      return 168
    } else {
      return value
    }
  }

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
    setItem('msgBoxHeight', calcTogglerY(togglerY))
  }

  useEffect(() => {
    setMsgBoxHeight(calcTogglerY(togglerY))
  }, [togglerY])

  const togglerStyle = useMemo(
    () => ({
      bottom: msgBoxHeight + 8,
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
