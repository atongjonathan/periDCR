import { Stack, Header, Button, Table, Card } from '@nordhealth/react'
import { Link, useNavigate } from 'react-router-dom'
import React, { useEffect, use, useState, useContext } from 'react'
import axios from 'axios'
import AuthContext from '../context/AuthContext';
import { UserContext } from '../context/UserContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const Patients = () => {
    const [patients, setPatients] = useState([])
    let { authTokens, } = useContext(AuthContext)
    let { setUserLoading } = useContext(UserContext)
    const navigate = useNavigate()


    useEffect(() => {
        async function getPatients() {
            const getPatientUrl = BACKEND_URL + '/api/patient'
            let reqOptions = {
                method: 'GET',
                url: getPatientUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authTokens?.access,
                },

            };

            try {
                const response = await axios.request(reqOptions);
                let data = response.data
                setPatients(data); // Set the fetched user data
            } catch (error) {
                console.log(error); // Log any error
            }
        }
        setUserLoading(true)
        getPatients(); // Call the function to fetch user data
        setUserLoading(false)


    }, []); // Re-run the effect when `user` changes
    return (
        <Stack>
            <Header expand>
                <h2 className="n-typescale-l">Patients</h2>
                <Link slot="end" to="/new-patient">
                    <Button type="button" variant="primary">
                        Add Patient
                    </Button>
                </Link>

            </Header>

            <Stack className="n-padding-i-l">

                <Card padding='none'>
                    <Table>
                        <table>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Full Name</th>
                                    <th>ID</th>
                                    <th>Email</th>
                                    <th>Gender</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    patients.length == 0 ? (
                                        <tr>
                                            <td><h1>No Patients</h1>
                                            </td>

                                        </tr>
                                    ) :

                                        patients.map((patient, idx) => {
                                            return (
                                                <tr className='patient' onClick={() => navigate("/patient/" + patient.name)} title={patient.name} key={patient.name}>
                                                    <td>{idx + 1}</td>
                                                    <td>{patient.first_name + ' ' + patient.middle_name + ' ' + patient.last_name}</td>
                                                    <td>{patient.name}</td>
                                                    <td>{patient.email}</td>
                                                    <td>{patient.sex}</td>
                                                </tr>
                                            )

                                        })

                                }


                            </tbody>
                        </table>
                    </Table>
                </Card>

            </Stack>
        </Stack>
    )
}
