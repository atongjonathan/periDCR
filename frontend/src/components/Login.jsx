import { useEffect, useRef, useState } from "react";
import "./css/Login.css";
import { Card, Stack, Input, Button, ToastGroup, Toast, Banner } from "@nordhealth/react";
import { Link } from 'react-router-dom';
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


export function Login() {
    const username = useField("username");
    const password = useField("password");




    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();

    const { user, toastMessage, toastVariant,
        showToast, setShowToast, loginUser } = useContext(AuthContext)




    useEffect(() => {
        document.title = 'Log In';
    }, []);

    useEffect(() => {
        if (user) {
            navigate("/")
        }

    }, [user]);

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
            setLoading(true)
            const response = await loginUser(username.value, password.value);
            setLoading(false);

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

            <main className="n-reset n-stack-horizontal">
                <Stack className="login_stack">
                    {showToast && (
                        <Banner shadow variant={toastVariant} >{toastMessage}</Banner>

                    )}
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
                                <Button type="submit" loading={loading} expand variant="primary">
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
