import React, { useContext, useEffect, useState, useRef } from 'react'
import AuthContext from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { Card, Stack, Input, Button, Select, ToastGroup, Toast, Header, Layout, Badge } from "@nordhealth/react";
import Frappe from '../utils/Frappe';
import EHRBase from '../utils/EHRBase';
import axios from 'axios';


const frappe = Frappe()
const ehrbase = EHRBase()


const badgeStatus = {
    "": "Neutral",
    "warning": "Not Saved",
    "danger": "Save Failed",
    "success": "Active",
    "info": "Saving ...",
    "highlight": "Already Exists"
}


function useField(name, initialValue = "") {
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState();
    const ref = useRef(null);
    const valid = value;

    useEffect(() => {
        if (valid) {
            setError(undefined);
        }
    }, [valid]);

    return {
        setError,
        valid,
        value,
        focus: () => ref.current?.focus(),
        inputProps: {
            name,
            value,
            onInput: (e) => {
                const input = e.target;
                setValue(input.value);
            },
            error,
            ref,
        },
    };
}


export const NewPatient = () => {
    const [loading, setLoading] = useState(false)

    const { authTokens } = useContext(AuthContext)

    const navigate = useNavigate()


    const [status, setStatus] = useState("warning")

    const first_name = useField("first_name");
    const sex = useField("sex");

    async function handleSubmit(e) {
        setLoading(true)

        e.preventDefault()

        if (first_name.valid && sex.valid) {
            setStatus("info")

            const formData = new FormData(e.target);
            // Convert FormData to an object
            const formObject = Object.fromEntries(formData.entries());

            let frappeResponse = await frappe.createPatient(formObject)

            if (frappeResponse.data) {

                let ehrbaseResponse = await ehrbase.createEHR()

                if (ehrbaseResponse.ehr_id) {
                    let patient = { ...formObject, ...ehrbaseResponse };
                    let backendResponse = await createPatient(patient);

                    if (backendResponse?.status == 201) {
                        setStatus("success");
                        navigate("/")
                    }
                    else {
                        console.log(backendResponse)
                        setStatus("danger")
                    }

                }


            }
            else if (frappeResponse.error === 'DuplicateEntryError') {
                setStatus("highlight")
            }
            else {
                console.log(frappeResponse)
                setStatus("danger")
            }

        } else {
            if (!first_name.valid) {
                first_name.setError("This field is required");
                first_name.focus();
            }

            if (!sex.valid) {
                sex.setError("This field is required");
                sex.focus();
            }
        }

        setLoading(false);

    }

    async function createPatient(formObject) {
        const backendBaseUrl = import.meta.env.VITE_BACKEND_URL
        const signUpUrl = `${backendBaseUrl}/api/create-patient`
        const reqOptions = {
            url: signUpUrl,
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authTokens?.access,
            },
            data: formObject,
        };

        try {
            const response = await axios.request(reqOptions);
            // const response = await fetch(tokenUrl, reqOptions)
            return response;
        } catch (error) {
            return error.response;
        }
    }

    useEffect(() => {
        document.title = 'New Patient'

    }, [])

    return (



        <form action="#" method='post' onSubmit={handleSubmit}>

            <Header expand>

                <h2 className='n-typescale-l'>New Patient</h2>
                <Badge variant={status}>{badgeStatus[status]}</Badge>
                <Button type='submit' loading={loading} slot='end' variant='primary'>
                    Save
                </Button>
            </Header>
            <Card>


                <Stack direction='horizontal'>
                    <Stack>
                        <Input type='text' name='first_name' label='First Name' expand required {...first_name.inputProps}></Input>
                        <Input type='text' name='middle_name' label='Middle Name' expand></Input>
                        <Input type='text' name='last_name' label='Last Name' expand></Input>
                        <Select label='Sex' name='sex' expand required {...sex.inputProps}>
                            <option value="">Select Sex</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Genderqueer">Genderqueer</option>
                            <option value="Non-Conforming">Non-Conforming</option>
                            <option value="Other">Other</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                            <option value="Transgender">Transgender</option>
                        </Select>

                    </Stack>
                    <Stack>
                        <Input type='text' name='phone' label='Phone' expand></Input>
                        <Input type='email' name='email' label='Email' expand></Input>
                        <Input type='date' name='dob' label='Date of Birth' expand></Input>
                        <Select label='Blood Group' expand>
                            <option value="">Select Blood Group</option>
                            <option value="A Positive">A Positive</option>
                            <option value="A Negative">A Negative</option>
                            <option value="B Positive">B Positive</option>
                            <option value="B Negative">B Negative</option>
                            <option value="O Positive">O Positive</option>
                            <option value="O Negative">O Negative</option>
                            <option value="AB Positive">AB Positive</option>
                            <option value="AB Negative">AB Negative</option>
                        </Select>
                    </Stack>
                </Stack>


            </Card>
            <ToastGroup>
                <Toast variant='primary'>Patient Created</Toast>
            </ToastGroup>




        </form>

    )
}
