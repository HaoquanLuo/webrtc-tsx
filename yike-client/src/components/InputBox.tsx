import React, { ChangeEvent } from 'react'

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
  const uid = crypto.randomUUID()
  return (
    <div px-1>
      <label
        className={`px-1 text-base ${
          required ? "after='content-[*] text-red-6'" : ''
        } `}
        htmlFor={`input-${uid}`}
      >
        {tag}
      </label>
      <div py-1>
        <input
          className="w-full h-a p-2 text-lg rd-2 b-gray-2 b-op-20 b-1 outline-none"
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
