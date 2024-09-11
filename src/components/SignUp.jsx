import { useEffect, useRef, useState } from "react";
import { Card, Stack, Input, Button, Select } from "@nordhealth/react";
import { Link } from 'react-router-dom'
import "./css/SignUp.css";


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
    const username = useField("username");
    const first_name = useField("first_name");
    const last_name = useField("last_name");
    const password = useField("password");
    const vGroup = useField("group");
    const role = useField("role");
    const confirm_password = useField("confirm_password");

    const [roles, setRoles] = useState([])
    const [group, setGroup] = useState("")




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



    function handleSubmit(e) {
        e.preventDefault();
        if (!vGroup.valid) {
            vGroup.setError("Please select a group");
            vGroup.focus();
        }
        if (!role.valid) {
            role.setError("Please select a role");
            role.focus();
        }
        if (username.valid && password.valid) {
            alert(`User: ${username.value}\nPassword: ${password.value}`);
        }

        if (!password.valid) {
            password.setError("Please enter a password");
            password.focus();
        }
        if (!confirm_password.valid) {
            password.setError("Please confirm your password");
            password.focus();
        }
        if (password.value != confirm_password.value) {
            console.log(password, confirm_password)
            confirm_password.setError("Passwords do not match");
            confirm_password.focus();
        }



        if (!username.valid) {
            username.setError("Please enter a username");
            username.focus();
        }
        if (!first_name.valid) {
            first_name.setError("Please enter a first name");
            first_name.focus();
        }
    }

    return (

        <>


            <main className="n-reset n-stack-horizontal">
                <Stack className="signup_stack">

                    <Card padding="l">
                        <h2 slot="header">Sign up to periDCR</h2>
                        <form action="#" onSubmit={handleSubmit}>
                            <Stack direction="horizontal" wrap>
                                <Select className="select" label="Group" name="group" value={group} onInput={handleInputChange} required {...group.inputProps}>
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

                                ></Input>
                                <Input
                                    label="Username"

                                    type="text"
                                    {...username.inputProps}
                                    required
                                ></Input>
                                <Input
                                    label="Email"

                                    type="email"
                                    placeholder="user@example.com"
                                    {...username.inputProps}
                                    required
                                ></Input>

                                <div className="password">
                                    <Input
                                        label="Password"
                                        type="password"
                                        placeholder="••••••••"
                                        {...password.inputProps}
                                        required
                                    ></Input>
                                </div>

                                <div className="password">
                                    <Input
                                        label="Confirm Password"
                                        type="password"
                                        placeholder="••••••••"
                                        {...confirm_password.inputProps}
                                        required
                                    ></Input>
                                </div>
                                <Stack justifyContent="center" alignItems="center">
                                    <Button type="submit" variant="primary">
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
