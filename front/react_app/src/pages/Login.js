import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { backendUrl } from 'utils'
import axios from 'axios'
import globalContext from 'contexts/globalContext'
import Logo from 'components/Logo'
import ErrorMsg from 'components/ErrorMsg'

export default function Login() {
  const { register, handleSubmit, watch } = useForm()
  const { login } = useContext(globalContext)
  const [errorMsg, setErrorMsg] = useState()

  const userName = watch('username', '')
  const userPassword = watch('password', '')

  const onSubmit = async (data) => {
    const url = `${backendUrl}/dj-rest-auth/login/`
    try {
      const res = await axios.post(url, data)
      login(res.data)
    } catch (err) {
      setErrorMsg(err.response.data)
    }
  }

  return (
    <div className="d-flex align-items-center h-100">
      <main className="m-auto w-100" style={{ maxWidth: 350 }}>
        <div className="mb-3 text-center">
          <Logo />
        </div>
        {errorMsg && <ErrorMsg message={errorMsg} />}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-floating">
            <input className="form-control" id="login" {...register('username')} placeholder="login" />
            <label htmlFor="login">Логин</label>
          </div>
          <div className="form-floating mt-2">
            <input
              type="password"
              className="form-control"
              id="password"
              {...register('password')}
              placeholder="password"
            />
            <label htmlFor="password">Пароль</label>
          </div>
          {userName.trim() !== '' && userPassword.trim() !== '' ? (
            <button className="w-100 btn btn-lg btn-primary mt-3" type="submit">
              Войти
            </button>
          ) : (
            <button className="w-100 btn btn-lg btn-primary mt-3" disabled type="submit">
              Войти
            </button>
          )}
        </form>
        <Link to="/registration" className="w-100 btn btn-lg btn-link mt-3" type="submit">
          Зарегистрироваться
        </Link>
      </main>
    </div>
  )
}
