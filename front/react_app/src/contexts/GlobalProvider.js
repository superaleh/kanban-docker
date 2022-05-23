import React, { useReducer } from 'react'
import { useNavigate } from 'react-router-dom'

import { authAxios, backendUrl } from 'utils'
import globalContext from './globalContext'
import { globalReducer, LOGIN, LOGOUT } from './globalReducer'

const userUrl = backendUrl + '/dj-rest-auth/user/'

const GlobalProvider = (props) => {
  const [globalState, dispatch] = useReducer(globalReducer, {
    authUser: null,
    checkedAuth: false,
    board: null,
    setBoard: null,
  })
  const navigate = useNavigate()

  const login = async (resData) => {
    localStorage.setItem('accessToken', resData.access_token)
    localStorage.setItem('refreshToken', resData.refresh_token)

    const { data } = await authAxios.get(userUrl)
    dispatch({ type: LOGIN, user: data })
    navigate('/', { replace: true })
  }

  const checkAuth = async () => {
    try {
      const { data } = await authAxios.get(userUrl)
      dispatch({ type: LOGIN, user: data })
    } catch (err) {
      dispatch({ type: LOGOUT })
    }
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    dispatch({ type: LOGOUT })
    navigate('/', { replace: true })
  }

  return (
    <globalContext.Provider
      value={{
        authUser: globalState.authUser,
        checkedAuth: globalState.checkedAuth,
        checkAuth,
        login,
        logout,
      }}
    >
      {props.children}
    </globalContext.Provider>
  )
}

export default GlobalProvider
