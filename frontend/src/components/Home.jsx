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
  }, [])
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



            <NavGroup heading='Portal'>
              {
                user.role == 'Admin' &&
                <NavItem href="administrator" icon="navigation-dashboard">
                  Front Office
                  <NavGroup slot="subnav">

                    <NavItem href="#" icon="navigation-dashboard">
                      Registration
                      <NavGroup slot="subnav">

                        <NavItem href="registration" icon="navigation-dashboard">
                          Register Patient
                        </NavItem>

                        <NavItem href="#" icon="navigation-dashboard">
                          Register Death
                          <NavGroup slot="subnav">

                            <NavItem href="search/death" icon="navigation-dashboard">
                              Existing Patient Death
                            </NavItem>

                            <NavItem href="new_death" icon="navigation-dashboard">
                              New Patient Death
                            </NavItem>

                          </NavGroup>
                        </NavItem>

                      </NavGroup>
                    </NavItem>

                    <NavItem href="admission" icon="navigation-dashboard">
                      Admission
                    </NavItem>

                    <NavItem href="#" icon="navigation-dashboard">
                      Billing & Revenue
                    </NavItem>

                  </NavGroup>
                </NavItem>
              }
              {
                user.role == 'Health Records Officer' &&
                <NavItem href="back" icon="navigation-dashboard">
                  Administrator
                  <NavGroup slot="subnav">

                    <NavItem href="person" icon="navigation-dashboard">
                      HR
                    </NavItem>

                    <NavItem href="#" icon="navigation-dashboard">
                      Logistics
                      <NavGroup slot="subnav">

                        <NavItem href="logistics_stock" icon="navigation-dashboard">
                          Stock
                        </NavItem>

                      </NavGroup>
                    </NavItem>

                    <NavItem href="#" icon="navigation-dashboard">
                      Insurance
                      <NavGroup slot="subnav">

                        <NavItem href="biometrics" icon="navigation-dashboard">
                          Capture Biometrics
                        </NavItem>

                        <NavItem href="#" icon="navigation-dashboard">
                          Validate
                        </NavItem>

                      </NavGroup>
                    </NavItem>

                    <NavItem href="#" icon="navigation-dashboard">
                      Addresses
                      <NavGroup slot="subnav">

                        <NavItem href="hcp" icon="navigation-dashboard">
                          HCP Address
                        </NavItem>

                        <NavItem href="electronics" icon="navigation-dashboard">
                          Electronic Address
                        </NavItem>

                      </NavGroup>
                    </NavItem>

                  </NavGroup>
                </NavItem>
              }
              {
                user.role == 'Nursing Office' && <NavItem href="nurse-station" icon="navigation-dashboard">
                  Nurse Station
                  <NavGroup slot="subnav">

                    <NavItem href="#" icon="navigation-dashboard">
                      Triage
                      <NavGroup slot="subnav">

                        <NavItem href="search/vitals" icon="navigation-dashboard">
                          Vitals
                        </NavItem>

                        <NavItem href="#" icon="navigation-dashboard">
                          Labels
                        </NavItem>

                      </NavGroup>
                    </NavItem>

                    <NavItem href="search/cardex" icon="navigation-dashboard">
                      Cardex
                    </NavItem>

                    <NavItem href="#" icon="navigation-dashboard">
                      Prescription
                    </NavItem>

                    <NavItem href="#" icon="navigation-dashboard">
                      Body Weight & Height
                      <NavGroup slot="subnav">

                        <NavItem href="search/height" icon="navigation-dashboard">
                          Height
                        </NavItem>

                        <NavItem href="search/weight" icon="navigation-dashboard">
                          Weight
                        </NavItem>

                      </NavGroup>
                    </NavItem>

                    <NavItem href="search/bmi" icon="navigation-dashboard">
                      Body Mass Index
                    </NavItem>

                    <NavItem href="search/counselling" icon="navigation-dashboard">
                      Counselling
                    </NavItem>

                  </NavGroup>
                </NavItem>
              }
              {
                user.role == 'Medical Officer' &&
                <NavItem href="consultation" icon="navigation-dashboard">
                  Consultation
                  <NavGroup slot="subnav">

                    <NavItem href="#" icon="navigation-dashboard">
                      In Patient
                      <NavGroup slot="subnav">

                        <NavItem href="#" icon="navigation-dashboard">
                          Care Plan
                        </NavItem>

                        <NavItem href="#" icon="navigation-dashboard">
                          Progress Notes
                        </NavItem>

                        <NavItem href="#" icon="navigation-dashboard">
                          Prescribe Medication
                        </NavItem>

                        <NavItem href="#" icon="navigation-dashboard">
                          Nursing Cardex
                        </NavItem>

                        <NavItem href="#" icon="navigation-dashboard">
                          Request Lab Test
                        </NavItem>

                        <NavItem href="#" icon="navigation-dashboard">
                          Request Imaging
                        </NavItem>

                        <NavItem href="#" icon="navigation-dashboard">
                          Review Patient
                        </NavItem>

                        <NavItem href="#" icon="navigation-dashboard">
                          Admissions
                        </NavItem>

                      </NavGroup>
                    </NavItem>

                    <NavItem href="#" icon="navigation-dashboard">
                      Out Patient
                      <NavGroup slot="subnav">

                        <NavItem href="search/clerk" icon="navigation-dashboard">
                          Clerk Patient
                        </NavItem>

                        <NavItem href="search/request" icon="navigation-dashboard">
                          Request Test
                        </NavItem>

                        <NavItem href="#" icon="navigation-dashboard">
                          Request Imaging
                        </NavItem>

                        <NavItem href="search/prescription" icon="navigation-dashboard">
                          Prescribe Medication
                        </NavItem>

                        <NavItem href="#" icon="navigation-dashboard">
                          Progress Notes
                        </NavItem>

                        <NavItem href="#" icon="navigation-dashboard">
                          Search
                        </NavItem>

                      </NavGroup>
                    </NavItem>

                  </NavGroup>
                </NavItem>
              }
              {
                user.role == 'Clinical Officer' &&
                <NavItem href="clinics" icon="navigation-dashboard">
                  Clinics
                  <NavGroup slot="subnav">

                    <NavItem href="#" icon="navigation-dashboard">
                      OPD
                      <NavGroup slot="subnav">

                        <NavItem href="#" icon="navigation-dashboard">
                          Clerk Patient
                        </NavItem>

                        <NavItem href="#" icon="navigation-dashboard">
                          Request Test
                        </NavItem>

                        <NavItem href="#" icon="navigation-dashboard">
                          Request Imaging
                        </NavItem>

                        <NavItem href="#" icon="navigation-dashboard">
                          Prescribe Medication
                        </NavItem>

                        <NavItem href="#" icon="navigation-dashboard">
                          Progress Notes
                        </NavItem>

                        <NavItem href="#" icon="navigation-dashboard">
                          Search
                        </NavItem>

                      </NavGroup>
                    </NavItem>

                    <NavItem href="#" icon="navigation-dashboard">
                      Specialized Clinics
                    </NavItem>

                  </NavGroup>
                </NavItem>
              }




              {
                user.role == 'Lab Technician' &&
                <NavItem href="laboratory" icon="navigation-dashboard">
                  Laboratory
                  <NavGroup slot="subnav">

                    <NavItem href="#" icon="navigation-dashboard">
                      Microbiology
                    </NavItem>

                    <NavItem href="#" icon="navigation-dashboard">
                      Hematology
                    </NavItem>

                    <NavItem href="#" icon="navigation-dashboard">
                      Urinalysis
                    </NavItem>

                    <NavItem href="#" icon="navigation-dashboard">
                      Clinical Chemistry
                    </NavItem>

                    <NavItem href="#" icon="navigation-dashboard">
                      Coagulation
                    </NavItem>

                    <NavItem href="#" icon="navigation-dashboard">
                      Serology
                    </NavItem>

                  </NavGroup>
                </NavItem>
              }

              {
                user.role == 'Radiologist' && <NavItem href="radiology" icon="navigation-dashboard">
                  Radiology
                  <NavGroup slot="subnav">

                    <NavItem href="#" icon="navigation-dashboard">
                      X-ray
                    </NavItem>

                    <NavItem href="#" icon="navigation-dashboard">
                      Ultrasound
                    </NavItem>

                    <NavItem href="#" icon="navigation-dashboard">
                      Computed Tomography (CT)
                    </NavItem>

                    <NavItem href="#" icon="navigation-dashboard">
                      Magnetic Resonance Imaging (MRI)
                    </NavItem>

                  </NavGroup>
                </NavItem>
              }


              {
                user.role == 'Pharmacist' &&
                <NavItem href="pharmarcy" icon="navigation-dashboard">
                  Pharmarcy
                  <NavGroup slot="subnav">

                    <NavItem href="#" icon="navigation-dashboard">
                      Fill Prescription
                    </NavItem>

                    <NavItem href="stock" icon="navigation-dashboard">
                      Stock
                    </NavItem>

                    <NavItem href="#" icon="navigation-dashboard">
                      Drug Index
                    </NavItem>

                    <NavItem href="#" icon="navigation-dashboard">
                      Counselling
                    </NavItem>

                    <NavItem href="#" icon="navigation-dashboard">
                      Consultation
                    </NavItem>

                    <NavItem href="search/problem" icon="navigation-dashboard">
                      Prescribe OTC
                    </NavItem>

                  </NavGroup>
                </NavItem>
              }


              <NavItem href="health-education" icon="navigation-dashboard">
                Health Education
              </NavItem>

              <NavItem href="icd" icon="navigation-dashboard">
                ICD Search
              </NavItem>

              <NavItem href="search/patient_card" icon="navigation-dashboard">
                Patient Search
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
