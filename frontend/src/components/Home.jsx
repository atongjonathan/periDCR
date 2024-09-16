
import React, { useContext, useState, useEffect } from 'react'
import { Button, Stack, Card, Avatar } from '@nordhealth/react'
import AuthContext from '../context/AuthContext'

export const Home = () => {
  const { user } = useContext(AuthContext)
  const [avatarUrl, setAvatarUrl] = useState(() => {
    return user
      ? `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&rounded=true&background=95eec5&size=35`
      : 'https://ui-avatars.com/api/?name=User&rounded=true&background=95eec5&size=35';
  });
  useEffect(() => {
    document.title = 'Home';
  }, [])
  return (

    <Stack gap='l'>

      <Stack className='n-padding-bs-xxl n-padding-be-xl' gap='l' alignItems='center'>
        <Avatar size='xxl' name={user.first_name + '  ' + user.last_name} src={avatarUrl}>PB</Avatar>
        <h1 className='n-typescale-xl'>Welcome, {user.first_name + '  ' + user.last_name}</h1>
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
