import React, { ChangeEvent, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login } from '@/api/system/auth'
import { sendCodeCaptcha } from '@/api/system/common'
import Input from '@/components/InputBox'
import { setItem } from '@/common/utils/storage'
import { setLogState, selectLogState } from '@/redux/features/user/userSlice'
import { setToken, setUserInfo } from '@/redux/features/user/userSlice'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

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
    const { data } = (await login({
      userName: user.username,
      password: user.password,
      code: user.code,
    })) as {
      data: {
        data: string
        errorCode: number
        msg: string
      }
    }

    if (data.errorCode === 0 && data.msg === 'ok') {
      setItem('token', data.data as string)
      setItem('userInfo', {
        username: user.username,
        password: user.password,
      })
      dispatch(setToken(data.data))
      dispatch(setLogState(true))
      dispatch(
        setUserInfo({
          username: user.username,
          password: user.password,
        }),
      )
    }
  }

  const logState = useSelector(selectLogState)

  useEffect(() => {
    if (logState) {
      navigate('/')
    } else {
      handleCode()
    }
  }, [logState])

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

export default Login
