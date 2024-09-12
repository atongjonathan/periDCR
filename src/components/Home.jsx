import React, { useEffect } from 'react'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { Button } from '@nordhealth/react'

export const Home = () => {
  let { user, logoutUser } = useContext(AuthContext);
  useEffect(() => {
    document.title = 'Home';
  })
  return (
    
    user ? (
      <section>
        <h1>Hello {user.username}</h1>
        <Button onclick={() => {
          logoutUser();
        }
        }>Logout</Button>
      </section>
    )

      : <h1>User is Null</h1>
  )
}
