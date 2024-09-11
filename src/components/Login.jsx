import { useEffect, useRef, useState } from "react";
import "./css/Login.css";
import { Card, Stack, Input, Button, ToastGroup, Toast } from "@nordhealth/react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

// Helper hook for input fields
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

// Function to handle login requests
async function loginUser(username, password) {
    const reqOptions = {
        url: 'http://127.0.0.1:8000/api/token/',
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            username,
            password,
        },
    };

    try {
        const response = await axios.request(reqOptions);
        return response;
    } catch (error) {
        console.log(error);
        return error.response;
    }
}

export function Login() {
    const username = useField("username");
    const password = useField("password");



    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('');
    const [showToast, setShowToast] = useState(false); // New state to control toast visibility

    const navigate = useNavigate();
    const authContext = useContext(AuthContext)

    useEffect(() => {
        document.title = 'Log In';
    }, []);

    // Effect to handle the display and automatic clearing of toast messages
    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false); // Hide the toast after 3 seconds
            }, 3000);

            return () => clearTimeout(timer); // Cleanup the timer on unmount
        }
    }, [showToast]); // Runs every time showToast changes

    async function handleSubmit(e) {
        e.preventDefault();

        if (username.valid && password.valid) {
            const response = await loginUser(username.value, password.value);

            if (response.status === 200) {
                // authContext.setUser(response.data)
                // console.log(authContext.user)
                navigate("/");

            } else {
                setToastVariant("danger");
                setToastMessage("Invalid Credentials");

            }
            setShowToast(true); // Trigger showing the toast
        } else {
            if (!password.valid) {
                password.setError("Please enter a password");
                password.focus();
            }

            if (!username.valid) {
                username.setError("Please enter a username");
                username.focus();
            }
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
                <Stack className="login_stack">
                    <Card padding="l">
                        <h2 slot="header">Sign in to periDCR</h2>
                        <form onSubmit={handleSubmit}>
                            <Stack>
                                <Input
                                    label="Username"
                                    expand
                                    type="text"
                                    {...username.inputProps}
                                    required
                                />
                                <div className="password">
                                    <Input
                                        label="Password"
                                        expand
                                        type="password"
                                        placeholder="••••••••"
                                        {...password.inputProps}
                                        required
                                    />
                                </div>
                                <Button type="submit" expand variant="primary">
                                    Sign in
                                </Button>
                            </Stack>
                        </form>
                    </Card>

                    <Card className="n-align-center">
                        New to periDCR? <Link to="/signup">Create an account</Link>.
                    </Card>
                </Stack>
            </main>
        </>
    );
}
