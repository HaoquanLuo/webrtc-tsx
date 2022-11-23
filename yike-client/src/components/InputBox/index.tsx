import React, { useRef, ChangeEvent } from 'react'

interface Input {
  tag: string
  inputKey: string
  inputValue: any
  changeFn: (key: string, event: ChangeEvent<HTMLInputElement>) => void
}

const Input = (props: Input) => {
  const { tag, inputKey, inputValue, changeFn } = props
  return (
    <>
      <div>{tag}:</div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => changeFn(inputKey, e)}
      />
    </>
  )
}

export default Input
