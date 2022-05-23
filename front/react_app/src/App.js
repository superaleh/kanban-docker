import React, { useEffect, useContext } from 'react'
import { Route, Routes } from 'react-router-dom'

import globalContext from 'contexts/globalContext'
import Kanban from 'pages/Kanban'
import Login from 'pages/Login'
import Registration from 'pages/Registration'
import Header from 'components/Header'

function App() {
  const { checkAuth, checkedAuth, authUser } = useContext(globalContext)

  useEffect(() => {
    if (checkedAuth) return
    checkAuth()
  }, [checkAuth, checkedAuth])

  if (!checkedAuth) {
    return null
  }

  if (authUser)
    return (
      <>
        <Header />
        <Routes>
          <Route path="/" element={<Kanban />} />
        </Routes>
      </>
    )
  else
    return (
      <>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
        </Routes>
      </>
    )
}

export default App
