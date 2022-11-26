import { generateUID } from '@/utils/helpers/generateUid'
import React, { ChangeEvent } from 'react'

interface Input {
  tag: string
  inputKey: string
  inputValue: any
  changeFn: (key: string, event: ChangeEvent<HTMLInputElement>) => void
}

const Input = (props: Input) => {
  const { tag, inputKey, inputValue, changeFn } = props
  const uid = generateUID()
  return (
    <div>
      <label htmlFor={`input-${uid}`}>{tag}:</label>
      <div></div>
      <input
        id={`input-${uid}`}
        type="text"
        value={inputValue}
        onChange={(e) => changeFn(inputKey, e)}
      />
    </div>
  )
}

export default Input
