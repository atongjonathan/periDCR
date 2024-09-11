import React from 'react'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'

export const Home = () => {
  let auth = useContext(AuthContext)
  return (
    <div>Home {auth.name}</div>
  )
}
