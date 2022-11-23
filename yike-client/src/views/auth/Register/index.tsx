import React, { ChangeEvent, useState } from 'react'
import md5 from 'md5'
import Input from '@/components/InputBox'
import { getEmailCaptcha, register } from '@/api/system/auth'

const Register: React.FC = () => {
  const [user, setUser] = useState({
    username: 'test1',
    password: '123456',
    email: 'lhq12230@163.com',
    code: '123456',
  })
  const handleUserChange = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    const nextUser = {
      ...user,
      [key]: e.target.value,
    }
    setUser(nextUser)
  }
  const handleSubmit = () => {
    register({
      userName: user.username,
      password: md5(user.password),
      email: user.email,
      code: user.code + '',
    })
  }
  const handleGenerateCode = () => {
    getEmailCaptcha({
      userName: user.username,
      email: user.email,
    })
  }
  return (
    <>
      <h2>Sign Up</h2>
      <Input
        tag={'username'}
        inputKey={'username'}
        inputValue={user.username}
        changeFn={(key, e) => {
          handleUserChange(key, e)
        }}
      />
      <Input
        tag={'password'}
        inputKey={'password'}
        inputValue={user.password}
        changeFn={(key, e) => {
          handleUserChange(key, e)
        }}
      />
      <Input
        tag={'email'}
        inputKey={'email'}
        inputValue={user.email}
        changeFn={(key, e) => {
          handleUserChange(key, e)
        }}
      />
      <Input
        tag={'code'}
        inputKey={'code'}
        inputValue={user.code}
        changeFn={(key, e) => {
          handleUserChange(key, e)
        }}
      />
      <div>
        <button onClick={handleSubmit}>submit</button>
        <button onClick={handleGenerateCode}>generate code</button>
      </div>
    </>
  )
}

export default Register
