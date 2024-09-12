import { useEffect, useRef, useState } from "react";
import { Card, Stack, Input, Button, Select, ToastGroup, Toast } from "@nordhealth/react";
import { Link, useNavigate } from 'react-router-dom'
import "./css/SignUp.css";
import axios from "axios";


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




export function SignUp() {
    const vGroup = useField("group");
    const role = useField("role");
    const username = useField("username");
    const first_name = useField("first_name");
    const last_name = useField("last_name");
    const email = useField("email");
    const password1 = useField("password");
    const password2 = useField("confirm_password");

    const [roles, setRoles] = useState([])
    const [group, setGroup] = useState("")

    const [loading, setLoading] = useState(false)
    const [showToast, setShowToast] = useState(false);
    const [toastVariant, setToastVariant] = useState('');
    const [toastMessage, setToastMessage] = useState('');

    let navigate = useNavigate();


    useEffect(() => {
        document.title = 'Sign Up'

    }, [])



    function handleInputChange(e) {
        let value = e.target.value
        setGroup(value)
        console.log(value, value == 'Administrator')
        if (value == 'Administrator') {
            setRoles(["", "Admin", "Health Records Officer"])
        }
        else if (value == 'Clinician') {
            setRoles(["", "Medical Officer", "Clinical Officer", "Nursing Officer", "Pharmacist", "Radiologist", "Lab Technician"])
        }

    }

    async function submitForm(formObject) {

        const backendBaseUrl = import.meta.env.VITE_BACKEND_URL
        const signUpUrl = `${backendBaseUrl}/api/create-user`
        const reqOptions = {
            url: signUpUrl,
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
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


    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData(e.target);

        // Convert FormData to an object
        const formObject = Object.fromEntries(formData.entries());

        const response = await submitForm(formObject);
        setLoading(false);
        if (response) {
            if (response.status === 201) {
                navigate("/login");
                setToastVariant("default");
                setToastMessage("SignUp Successful");
                setShowToast(true);

            } else if (response.status === 400) {
                let errors = response.data.errors
                if (errors.username) username.setError(errors.username[0]);
                if (errors.group) vGroup.setError(errors.group[0]);
                if (errors.role) role.setError(errors.role[0]);
                if (errors.first_name) first_name.setError(errors.first_name[0]);
                if (errors.last_name) last_name.setError(errors.last_name[0]);
                if (errors.email) email.setError(errors.email[0]);
                if (errors.password1) password1.setError(errors.password1[0]);
                if (errors.password2) password2.setError(errors.password2[0]);
            }
        }
        else {
            setToastVariant("danger");
            setToastMessage("Something went wrong");
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);

            }, 2000)

        }



    }

    return (

        <>
            {showToast && (
                <ToastGroup>
                    <Toast variant={toastVariant} autoDismiss={3000}>{toastMessage}</Toast>
                </ToastGroup>
            )}

            <main className="n-reset n-stack-horizontal">
                <Stack className="signup_stack">

                    <Card padding="l">
                        <h2 slot="header">Sign up to periDCR</h2>
                        <form action="#" method="post" onSubmit={handleSubmit}>
                            <Stack direction="horizontal" wrap>
                                <Select className="select" label="Group" name="group" onInput={handleInputChange} required {...group.inputProps}>
                                    <option value="">Select Group</option>
                                    <option value="Administrator">Administrator</option>
                                    <option value="Clinician">Clinician</option>

                                </Select>
                                <div className="role">
                                    <Select className="role" label="Role" name="role" required {...role.inputProps}>
                                        {
                                            roles.length > 0 ? roles.map((role) => (
                                                <option key={role} value={role}>{role ? role : "Select Role"}</option>

                                            )) : (<option value="">Select Group first</option>)

                                        }


                                    </Select>
                                </div>

                                <Input
                                    label="First Name"
                                    type="text"
                                    {...first_name.inputProps}
                                    required
                                ></Input>
                                <Input
                                    label="Last Name"
                                    type="text"
                                    {...last_name.inputProps}
                                    autocomplete="on"

                                ></Input>
                                <Input
                                    label="Username"

                                    type="text"
                                    {...username.inputProps}
                                    autocomplete="on"
                                    required
                                ></Input>
                                <Input
                                    label="Email"

                                    type="email"
                                    placeholder="user@example.com"
                                    {...email.inputProps}
                                    autocomplete="on"
                                    required
                                ></Input>

                                <div className="password">
                                    <Input
                                        label="Password"
                                        type="password"
                                        placeholder="••••••••"
                                        {...password1.inputProps}
                                        name="password1"
                                        autocomplete="on"
                                        required
                                    ></Input>
                                </div>

                                <div className="password">
                                    <Input
                                        label="Confirm Password"
                                        type="password"
                                        placeholder="••••••••"
                                        {...password2.inputProps}
                                        name="password2"
                                        autocomplete="on"
                                        required
                                    ></Input>
                                </div>
                                <Stack>
                                    <Button type="submit" expand loading={loading} variant="primary">
                                        Sign Up
                                    </Button>
                                </Stack>
                                <div>
                                    Have an account? <Link to="/login">Log In</Link>.
                                </div>

                            </Stack>
                        </form>
                    </Card>


                </Stack>
            </main>

        </>
    );
}
