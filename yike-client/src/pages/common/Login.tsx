import React, { ChangeEvent, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login } from '@/api/system/auth'
import { sendCodeCaptcha } from '@/api/system/common'
import InputBox from '@/components/InputBox'
import { setItem } from '@/common/utils/storage'
import { setLogState, selectLogState } from '@/redux/features/user/userSlice'
import { setToken, setUserInfo } from '@/redux/features/user/userSlice'
import { Button, notification } from 'antd'
import { AxiosError } from 'axios'
import {
  selectErrorMessage,
  setErrorMessage,
} from '@/redux/features/system/systemSlice'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [api, contextHolder] = notification.useNotification()

  const logState = useSelector(selectLogState)
  const errorMessage = useSelector(selectErrorMessage)

  const [loginUser, setLoginUser] = useState({
    username: 'test1',
    password: '123456',
    code: '',
  })

  const handleUserChange = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    const nextUser = {
      ...loginUser,
      [key]: e.target.value,
    }
    setLoginUser(nextUser)
  }

  const handleCode = async () => {
    const result = await sendCodeCaptcha()
    const captcha = document.getElementById('captcha') as HTMLElement
    if (captcha) {
      captcha.innerHTML = result.data as unknown as string
    }
  }

  const handleSubmit = async () => {
    try {
      const { data } = await login({
        userName: loginUser.username,
        password: loginUser.password,
        code: loginUser.code,
      })

      if (data.errorCode === 0 && data.msg === 'ok') {
        api.success({
          message: '登录成功',
          placement: 'top',
        })
        setItem('token', data.data as string)
        setItem('userInfo', {
          username: loginUser.username,
          password: loginUser.password,
        })
        dispatch(setToken(data.data))
        dispatch(setLogState(true))
        dispatch(
          setUserInfo({
            username: loginUser.username,
            password: loginUser.password,
          }),
        )
      }
    } catch (error) {
      const { response } = error as AxiosError<Common.ResponseData<string>>

      if (response !== undefined) {
        const { data } = response
        const { msg, errorCode } = data

        if (msg !== undefined && errorCode === 10000) {
          dispatch(
            setErrorMessage({
              key: `error_${Date.now()}`,
              content: '验证码错误',
            }),
          )
        }
      }
    }
  }

  useEffect(() => {
    if (logState) {
      setTimeout(() => {
        navigate('/')
      }, 500)
    } else {
      handleCode()
    }
  }, [logState])

  useEffect(() => {
    if (errorMessage.content !== '') {
      api.error({
        message: errorMessage.content,
        placement: 'top',
      })
    }
  }, [errorMessage.key])

  return (
    <div w-full h-full grid place-items-center>
      {contextHolder}
      <div
        className="
          relative
          w-110
          p-4
          flex
          flex-col
          gap-y-2
          bg-light
          bg-op-10
          rd-2
        "
      >
        <div id="register-top" grid gap-1 b-gray-2>
          <div text-4xl font-bold>
            登录
          </div>
        </div>
        <div id="register-main" after="content-empty mb-2">
          <div id="register-inputs" flex flex-col gap-2>
            <InputBox
              tag={'昵称'}
              required={true}
              inputKey={'username'}
              inputValue={loginUser.username}
              changeFn={(key, e) => {
                handleUserChange(key, e)
              }}
            />
            <InputBox
              tag={'密码'}
              required={true}
              inputKey={'password'}
              inputValue={loginUser.password}
              changeFn={(key, e) => {
                handleUserChange(key, e)
              }}
            />
            <div relative inline-flex gap-x-lg items-end>
              <InputBox
                tag={'图形验证码'}
                required={true}
                inputKey={'code'}
                inputValue={loginUser.code}
                changeFn={(key, e) => {
                  handleUserChange(key, e)
                }}
              />
              <div id="captcha" className="ml-6 rd-2"></div>
            </div>
          </div>
        </div>
        <div id="register-bottom" pt-2 grid place-items-center>
          <Button
            size="large"
            className="bg-blue-6 w-full hover:bg-#232323"
            onClick={handleSubmit}
          >
            登录
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Login
