import React, { ChangeEvent, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login } from '@/api/system/auth'
import { sendCodeCaptcha } from '@/api/system/common'
import InputBox from '@/components/commonComponent/InputBox'
import { setItem } from '@/common/utils/storage'
import { setLogState, selectLogState } from '@/redux/features/user/userSlice'
import { setToken, setUserInfo } from '@/redux/features/user/userSlice'
import { Button, notification } from 'antd'
import { AxiosError } from 'axios'
import {
  selectCurrentPath,
  selectErrorMessage,
  setErrorMessage,
} from '@/redux/features/system/systemSlice'
import md5 from 'md5'
import RegisterBox from './Register'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [api, contextHolder] = notification.useNotification()

  const currentPath = useSelector(selectCurrentPath)
  const logState = useSelector(selectLogState)
  const errorMessage = useSelector(selectErrorMessage)

  const [loginUser, setLoginUser] = useState({
    username: '',
    password: '',
    code: '',
  })
  const [showModal, setShowModal] = useState(false)

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
        password: md5(loginUser.password),
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
          password: md5(loginUser.password),
        })
        dispatch(setToken(data.data))
        dispatch(setLogState(true))
        dispatch(
          setUserInfo({
            username: loginUser.username,
            password: md5(loginUser.password),
          }),
        )
      }
    } catch (error) {
      const { response } = error as AxiosError<Common.ResponseData<string>>

      if (response !== undefined) {
        const { data } = response
        const { msg, errorCode } = data

        if (msg !== undefined && errorCode !== undefined) {
          dispatch(
            setErrorMessage({
              key: `error_${Date.now()}`,
              content: msg,
            }),
          )
        }
      }
    }
  }

  const handleModalShow = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    setShowModal(true)
  }

  const handleModalShowOff = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    setShowModal(false)
  }

  useEffect(() => {
    if (logState) {
      setTimeout(() => {
        navigate('/main')
      }, 500)
    }

    if (!logState && currentPath === '/') {
      handleCode()
    }
  }, [logState, currentPath])

  useEffect(() => {
    if (errorMessage.content !== '') {
      api.error({
        message: errorMessage.content,
        placement: 'top',
      })
    }
  }, [errorMessage.key])

  return (
    <div relative w-full h-full grid place-items-center>
      {contextHolder}
      <div
        className="
          relative
          w-110
          p-4
          flex
          flex-col
          gap-y-2
          bg-white
          rd-2
          shadow-[0_0px_5px_rgba(0,0,0,0.5)]
          dark:bg-dark
          dark:bg-op-80
          dark:shadow-[0_0px_5px_rgba(255,255,255,0.5)]
        "
      >
        <div id="login-top" grid gap-1 b-gray-2>
          <div text-4xl font-bold>
            登录
          </div>
        </div>
        <div id="login-main" after="content-empty mb-2">
          <div id="login-inputs" flex flex-col gap-2>
            <InputBox
              tag={'昵称'}
              inputKey={'username'}
              inputValue={loginUser.username}
              changeFn={(key, e) => {
                handleUserChange(key, e)
              }}
              data-cy="login-username"
            />
            <InputBox
              tag={'密码'}
              type="password"
              inputKey={'password'}
              inputValue={loginUser.password}
              changeFn={(key, e) => {
                handleUserChange(key, e)
              }}
              data-cy="login-password"
            />
            <div relative inline-flex gap-x-lg items-end>
              <InputBox
                tag={'图形验证码'}
                inputKey={'code'}
                inputValue={loginUser.code}
                changeFn={(key, e) => {
                  handleUserChange(key, e)
                }}
                data-cy="login-code"
              />
              <div id="captcha" className="ml-6 rd-2" />
            </div>
          </div>
        </div>
        <div id="login-submit" py-2 grid place-items-center>
          <Button
            size="large"
            className="bg-blue-6 w-full text-light hover:bg-#232323"
            onClick={handleSubmit}
            data-cy="login-submit"
          >
            登录
          </Button>
        </div>
        <div id="login-bottom" grid place-items-center>
          <a
            className="decoration-none text-sm text-blue visited:text-blue"
            href="#"
          >
            忘记密码？
          </a>
          <div w-full mb-4 pb-4 b-b-1 b-gray-2 b-op-20></div>
          <Button
            size="large"
            className="w-40 text-light bg-green-6 hover:bg-#232323"
            onClick={handleModalShow}
            data-cy="login-openModal"
          >
            创建新用户
          </Button>
        </div>
      </div>
      {showModal && (
        <div
          className="
            fixed
            top-0
            bottom-0
            left-0
            right-0
            bg-white
            bg-op-60
          "
        >
          <RegisterBox relative handleClick={(e) => handleModalShowOff(e)} />
        </div>
      )}
    </div>
  )
}

export default Login
