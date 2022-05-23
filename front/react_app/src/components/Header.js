import React, { useContext } from 'react'
import { User } from 'react-feather'

import globalContext from 'contexts/globalContext'
import Logo from './Logo'

export default function Header() {
  const { authUser, logout } = useContext(globalContext)

  return (
    <header className="d-flex align-items-center justify-content-between py-2 px-4 border-bottom bg-white">
      <Logo />
      <div className="d-flex align-items-center">
        <User size={18} className="me-1" />
        <div className="fw-bold me-2">{authUser.username}</div>
        <button onClick={logout} type="button" className="btn btn-outline-dark btn-sm">
          Выйти
        </button>
      </div>
    </header>
  )
}
