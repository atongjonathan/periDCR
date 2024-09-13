import React, { useEffect } from 'react'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { Button, Layout, Dropdown, Avatar, DropdownGroup, DropdownItem, Input, Header, Navigation, NavGroup, NavItem, Stack, Card, Icon, TopBar } from '@nordhealth/react'
import logo from '../assets/favicon.png'
import './css/Home.css'
export const Home = () => {
  let { user, logoutUser, avatarUrl } = useContext(AuthContext);
  useEffect(() => {
    document.title = 'Home';
  })
  return (

    user ? (
      <section>

        <Layout padding='none'>
          <Navigation slot='nav' stickyFooter>
            <Dropdown slot='header' expand>
              <Button size='s' slot='toggle' expand>
                <Avatar slot='start' className='n-color-background' variant='square' name="Peri Bloom" src={logo}>PB</Avatar>
                Peri Bloom
              </Button>
              <DropdownGroup heading={user.email}>
                <DropdownItem>
                <Icon slot='start' name="user-single"></Icon>
                  {user.role}
                  <Icon slot="end" name="interface-checked"></Icon>
                </DropdownItem>



              </DropdownGroup>

            </Dropdown>


            <NavGroup heading='WorkSpace'>
              <NavItem href="#" active icon="navigation-dashboard">Home</NavItem>
              <NavItem href="#" icon="navigation-dashboard">Payments
                <NavGroup slot='subnav'>
                  <NavItem href="#" icon="navigation-dashboard">Dashboard</NavItem>

                </NavGroup>
              </NavItem>

            </NavGroup>
            <Dropdown expand slot='footer'>
              <Button slot='toggle' expand className='n-color-background'>
                <Avatar slot='start' aria-hidden name={user.first_name + '  ' + user.last_name} src={avatarUrl}></Avatar>
                {user.first_name + '  ' + user.last_name}
              </Button>
              <DropdownGroup>
                <DropdownItem href='#'>View Profile</DropdownItem>
                <DropdownItem href='#'>Settings</DropdownItem>

              </DropdownGroup>
              <DropdownItem onclick={() => {
                logoutUser();
              }
              }>Log Out
                <Icon slot='end' name='interface-logout'></Icon>
              </DropdownItem>

            </Dropdown>
          </Navigation>
          <Header className='n-color-accent'>
            <Icon name="navigation-dashboard"></Icon>
            <h1 className='n-typescale-l'>Welcome</h1>
            <Input slot='end' size='m' type='search' hideLabel placeholder='Search'></Input>


          </Header>

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



        </Layout>
      </section>
    )

      : <h1>User is Null</h1>
  )
}
