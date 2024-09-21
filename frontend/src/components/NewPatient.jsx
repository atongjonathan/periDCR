import React, { useContext, useEffect, useState, useRef } from 'react'
import AuthContext from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Card, Stack, Input, Button, Select, Header, Badge } from "@nordhealth/react";
import Frappe from '../utils/Frappe';
import EHRBase from '../utils/EHRBase';
import axios from 'axios';
import { isValid, parse, isFuture } from 'date-fns';
import validator, { toBoolean } from 'validator'
import { UserContext } from '../context/UserContext';
import { MessageContext } from '../context/MessageContext';


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

function validateDOB(dob) {
    // Parse the date string into a valid Date object
    const parsedDate = parse(dob, 'yyyy-MM-dd', new Date());

    // Check if the parsed date is valid
    if (!isValid(parsedDate)) {
        return { valid: false, message: 'Invalid date format' };
    }

    // Check if the person is old enough
    if (isFuture(parsedDate)) {
        return { valid: false, message: 'Date of birth cannot be in the future' };
    }

    return { valid: true, message: 'Valid date of birth' };
}
export const NewPatient = () => {
    const [loading, setLoading] = useState(false)

    const { authTokens } = useContext(AuthContext)
    const { periUser, setTitle } = useContext(UserContext)

    const navigate = useNavigate()


    const [status, setStatus] = useState("warning")

    const { showToaster, showNotification } = useContext(MessageContext)


    // Form fields
    const first_name = useField("first_name");
    const sex = useField("sex");
    const middle_name = useField("middle_name");
    const blood_group = useField("blood_group");
    const last_name = useField("last_name");
    const phone = useField("phone");
    const email = useField("email");
    const dob = useField("dob");


    function validForm() {
        if (first_name.value == '') {
            first_name.setError("This field is required");
            first_name.focus()
            return false
        }

        if (sex.value == '') {
            sex.setError("This field is required");
            sex.focus()
            return false
        }
        if (toBoolean(email.value)) {
            if (!validator.isEmail(email.value)) {
                email.setError("Invalid email address");
                return false
            }
        }

        if (toBoolean(dob.value)) {
            let validDOB = validateDOB(dob.value)
            if (!validDOB.valid) {
                dob.setError(validDOB.message)
                return false
            }
        }
        if (toBoolean(phone.value)) {
            if (phone.value.length < 10) {
                console.log(phone.value == '')
                phone.setError("Phone number cannot be less than 10 characters");
                return false
            }
        }
        return true

    }
    async function handleSubmit(e) {
        setLoading(true)

        e.preventDefault()

        const formObject = {
            first_name: first_name.value,
            middle_name: middle_name.value,
            last_name: last_name.value,
            blood_group: blood_group.value,
            sex: sex.value,
            phone: phone.value,
            email: email.value,
            dob: dob.value
        };

        if (validForm()) {
            let frappeResponse = await frappe.createPatient(formObject)

            if (frappeResponse.data) {

                let ehrbaseResponse = await ehrbase.createEHR()

                if (ehrbaseResponse.ehr_id) {
                    let patient = { ...formObject, ...ehrbaseResponse };
                    patient.name = frappeResponse.data.name
                    let backendResponse = await createPatient(patient);
                    if (backendResponse?.status == 201) {
                        setStatus("success");
                        let patientUrl = "/patient/" + backendResponse.data.name
                        showNotification("Patient Created", `${patient.first_name} created by ${periUser.first_name + ' ' + periUser.last_name}`, "Prescribe Medication", "/pharmarcy")
                        navigate(patientUrl)
                    }
                    else {
                        showToaster("danger", "Backend Server Error")
                        setStatus("danger")
                    }

                }
                else {
                    console.log(ehrbaseResponse)
                    if (ehrbaseResponse.name == "AxiosError") {
                        showToaster("danger", "EHRBase Server is not running")
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
        setTitle( "New Patient")

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
            <Stack className='n-padding-i-l n-padding-b-l'>
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
                            <Input type='text' name='phone' label='Phone' expand {...phone.inputProps}></Input>
                            <Input type='email' name='email' label='Email' expand {...email.inputProps}></Input>
                            <Input type='date' name='dob' label='Date of Birth' expand {...dob.inputProps}></Input>
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
            </Stack>





        </form>

    )
}
