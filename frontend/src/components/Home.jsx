
import React, { useContext, useState, useEffect } from 'react'
import { Button, Stack, Card, Avatar } from '@nordhealth/react'
import AuthContext from '../context/AuthContext'
import { UserContext } from '../context/UserContext'

export const Home = () => {
  const { periUser,  setTitle } = useContext(UserContext)

  useEffect(() => {
    setTitle( "Home")
  }, [])
  return (

    <Stack gap='l'>

      <Stack className='n-padding-bs-xxl n-padding-be-xl' gap='l' alignItems='center'>
        <Avatar size='xxl' name={periUser.fullName} src={periUser.avatarUrl}>PB</Avatar>
        <h1 className='n-typescale-xl'>Welcome, {periUser.fullName}</h1>
      </Stack>
      <Stack gap='l' className='stack' direction='horizontal'>
        <Card padding='l'>
          <h2 slot='header'>Account overview</h2>
          <Stack direction='horizontal'>
            <Stack gap='l'>
              <p>
                View all saved data on your Nordhealth account and choose what activity is kept to personalize your
                experience.
              </p>
              <Button variant="primary">Manage your account</Button>
            </Stack>
          </Stack>

        </Card>
        <Card padding='l'>
          <h2 slot='header'>Account overview</h2>
          <Stack direction='horizontal'>
            <Stack gap='l'>
              <p>
                View all saved data on your Nordhealth account and choose what activity is kept to personalize your
                experience.
              </p>
              <Button variant="primary">Manage your account</Button>
            </Stack>
          </Stack>

        </Card>
      </Stack>



    </Stack>
  )
}
