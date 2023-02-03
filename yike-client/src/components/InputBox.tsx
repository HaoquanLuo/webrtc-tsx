import React, { ChangeEvent } from 'react'
import { v4 as uuidV4 } from 'uuid'

type InputKey = 'username' | 'password' | 'email' | 'code'

interface Input extends React.HTMLAttributes<HTMLInputElement> {
  tag?: string
  required?: boolean
  placeHolder?: string
  inputKey: InputKey
  inputValue: any
  changeFn: (key: string, event: ChangeEvent<HTMLInputElement>) => void
}

const InputBox = (props: Input) => {
  const {
    tag,
    required = false,
    placeHolder,
    inputKey,
    inputValue,
    changeFn,
    ...rest
  } = props
  const uid = uuidV4()
  return (
    <div px-1>
      <div inline-flex>
        <label className="px-1 text-base" htmlFor={`input-${uid}`}>
          {tag}
        </label>
        {required && <div className="text-red vertical-text-top">*</div>}
      </div>
      <div py-1>
        <input
          className="w-full h-a p-2 text-lg rd-2 b-gray-4 b-op-40 b-1 outline-none"
          id={`input-${uid}`}
          type="text"
          placeholder={placeHolder}
          value={inputValue}
          onChange={(e) => changeFn(inputKey, e)}
          {...rest}
        />
      </div>
    </div>
  )
}

export default InputBox
