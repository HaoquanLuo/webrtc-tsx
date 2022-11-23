import React, { ChangeEvent, useState, useEffect } from 'react'
import Input from '@/components/InputBox'
import { login } from '@/api/system/auth'
import { sendCodeCaptcha } from '@/api/system/common'
import { setItem } from '@/utils/storage'
import { useNavigate } from 'react-router-dom'

const Register: React.FC = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    username: 'test1',
    password: '123456',
    code: '',
  })
  const handleUserChange = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    const nextUser = {
      ...user,
      [key]: e.target.value,
    }
    setUser(nextUser)
  }
  const handleCode = async () => {
    const result = await sendCodeCaptcha()
    const captcha = document.getElementById('captcha') as HTMLElement
    if (captcha) {
      captcha.innerHTML = result.data as unknown as string
    }
  }
  const handleSubmit = async () => {
    const { data } = await login({
      userName: user.username,
      password: user.password,
      code: user.code,
    })
    if (data.errorCode === 0 && data.msg === 'ok') {
      setItem('token', data.data as any)
      navigate('/common/main')
    }
  }

  useEffect(() => {
    handleCode()
  }, [])

  return (
    <>
      <h2>Sign In</h2>
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
        tag={'code'}
        inputKey={'code'}
        inputValue={user.code}
        changeFn={(key, e) => {
          handleUserChange(key, e)
        }}
      />
      <div>
        <div id="captcha"></div>
        <button onClick={handleSubmit}>submit</button>
      </div>
    </>
  )
}

export default Register
