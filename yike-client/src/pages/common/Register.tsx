import React, { ChangeEvent, useEffect, useState } from 'react'
import md5 from 'md5'
import { v4 as uuidV4 } from 'uuid'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import InputBox from '@/components/commonComponent/InputBox'
import { getEmailCaptcha, login, register } from '@/api/system/auth'
import {
  selectLogState,
  setLogState,
  setToken,
  setUserInfo,
} from '@/redux/features/user/userSlice'
import { Button, notification } from 'antd'
import { AxiosError } from 'axios'
import {
  setErrorMessage,
  selectErrorMessage,
} from '@/redux/features/system/systemSlice'
import { setItem } from '@/common/utils/storage'

interface RegisterBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  handleClick?: (event: React.MouseEvent<HTMLElement>) => void
}

const RegisterBox: React.FC<RegisterBoxProps> = (props) => {
  const { handleClick } = props
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [api, contextHolder] = notification.useNotification()

  const logState = useSelector(selectLogState)
  const errorMessage = useSelector(selectErrorMessage)

  const [registerUser, setRegisterUser] = useState({
    username: '',
    password: '',
    email: '',
    code: '',
  })
  const [codeEmpty, setCodeEmpty] = useState(true)

  const handleUserChange = async (
    key: string,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const nextUser = {
      ...registerUser,
      [key]: e.target.value,
    }
    await (async () => setRegisterUser(nextUser))()
    if (key === 'code' && nextUser.code !== '') {
    }
  }

  const handleSubmit = async () => {
    try {
      const result = await register({
        userName: registerUser.username,
        password: md5(registerUser.password),
        email: registerUser.email,
        code: registerUser.code,
      })

      const { data } = result
      const { msg, errorCode } = data

      if (msg === 'ok' && errorCode === 0) {
        api.success({
          message: '账号创建成功！',
          placement: 'top',
        })

        const loginResult = await login({
          userName: registerUser.username,
          password: md5(registerUser.password),
          code: 'register',
        })

        const { data } = loginResult
        const { msg, errorCode } = data

        if (msg === 'ok' && errorCode === 0) {
          setItem('token', data.data as string)
          setItem('userInfo', {
            username: registerUser.username,
            password: registerUser.password,
          })
          dispatch(setToken(data.data))
          dispatch(setLogState(true))
          dispatch(
            setUserInfo({
              username: registerUser.username,
              password: md5(registerUser.password),
            }),
          )
        }
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
              content: '验证码为六位数字',
            }),
          )
        }
      }
    }
  }

  const handleGenerateCode = async () => {
    try {
      const result = await getEmailCaptcha({
        userName: registerUser.username,
        email: registerUser.email,
      })
      const { data } = result
      if (data.msg === 'ok' && data.errorCode === 0) {
        setCodeEmpty(false)
      }
    } catch (error) {
      const { response } = error as AxiosError<Common.ResponseData<string>>

      if (response !== undefined) {
        const { data } = response
        const { msg } = data

        if (msg !== undefined) {
          dispatch(
            setErrorMessage({
              key: uuidV4(),
              content: msg,
            }),
          )
        }
      }
      console.error(error)
    }
  }

  useEffect(() => {
    if (logState) {
      setTimeout(() => {
        navigate('/main')
      }, 2000)
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
          bg-white
          rd-2
          shadow-[0_0px_5px_rgba(0,0,0,0.5)]
          dark:bg-dark
          dark:shadow-[0_0px_5px_rgba(255,255,255,0.5)]
        "
      >
        <div
          onClick={handleClick}
          className="
            cursor-pointer
            absolute
            grid
            place-items-center
            top--4
            right--4
            w-8
            h-8
            rd-100
            b-gray-4
            b-2
            bg-light
            text-light
          "
        >
          <div i-mdi:window-close text-dark text-lg font-bold />
        </div>

        <div id="register-top" grid gap-1 b-gray-2>
          <div text-4xl font-bold>
            注册
          </div>
          <div>这将很快完成!</div>
        </div>
        <div
          id="register-main"
          before="content-empty absolute left-0 right-0 w-full b-t-1 b-op-50 b-gray-2"
          after="content-empty mb-2"
        >
          <div id="register-inputs" pt-2 flex flex-col gap-2>
            <InputBox
              tag={'昵称'}
              required={true}
              inputKey={'username'}
              inputValue={registerUser.username}
              changeFn={(key, e) => {
                handleUserChange(key, e)
              }}
              data-cy="register-username"
            />
            <InputBox
              tag={'密码'}
              required={true}
              inputKey={'password'}
              inputValue={registerUser.password}
              changeFn={(key, e) => {
                handleUserChange(key, e)
              }}
              data-cy="register-password"
            />
            <InputBox
              tag={'邮箱'}
              required={true}
              inputKey={'email'}
              inputValue={registerUser.email}
              changeFn={(key, e) => {
                handleUserChange(key, e)
              }}
              data-cy="register-email"
            />
            <div relative inline-flex gap-x-lg items-end>
              <InputBox
                tag={'邮箱验证码'}
                required={true}
                inputKey={'code'}
                inputValue={registerUser.code}
                changeFn={(key, e) => {
                  handleUserChange(key, e)
                }}
                data-cy="register-code"
              />
              <Button
                className="absolute text-light bottom-2 right-5 bg-orange hover:bg-#232323"
                size="large"
                onClick={handleGenerateCode}
                data-cy="register-generateCode"
              >
                获取验证码
              </Button>
            </div>
          </div>
        </div>
        <div id="register-bottom" pt-2 grid place-items-center>
          <Button
            disabled={codeEmpty}
            size="large"
            className="w-60 bg-green-6 hover:bg-#232323"
            onClick={handleSubmit}
            data-cy="register-submit"
          >
            注册
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RegisterBox
