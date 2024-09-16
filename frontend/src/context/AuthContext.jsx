import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState, useRef } from 'react';
import { createContext } from 'react';
import axios from 'axios';

const AuthContext = createContext({});
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;


export default AuthContext;
export const AuthProvider = ({ children }) => {

    const [authTokens, setAuthTokens] = useState(() => {
        // Initialize from localStorage if available
        const tokens = localStorage.getItem('authTokens');
        return tokens ? JSON.parse(tokens) : null;
    });

    const [user, setUser] = useState(() => {
        // Decode token to extract user info
        return authTokens ? jwtDecode(authTokens.access) : null;
    });



    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('');
    const [showToast, setShowToast] = useState(false); // New state to control toast visibility



    const [refresh_time, setRefresh_time] = useState(false)
    const intervalRef = useRef(null); // Store the interval ID here



    // Refresh token function
    const refreshAccessToken = async (authTokens) => {
        const refreshUrl = API_BASE_URL + '/api/token/refresh/'
        let decoded = jwtDecode(authTokens.access)
        let time_to_expire = decoded.exp * 1000
        console.log("Current Token will expire on " + new Date(time_to_expire).toString())
        const reqOptions = {
            url: refreshUrl,
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                refresh: authTokens?.refresh
            },
        };
        try {
            const response = await axios.request(reqOptions);

            const newTokens = response.data;
            setAuthTokens(newTokens);
            setUser(jwtDecode(newTokens.access));
            localStorage.setItem('authTokens', JSON.stringify(newTokens));
            console.log("Token Refreshed")

            return newTokens;
        } catch (error) {
            if (error.response?.status == 401) {
                console.log('Failed to refresh token', error);
                logoutUser();
            }
            else {
                setToastVariant("danger");
                setToastMessage("Something went wrong");
                setShowToast(true);
            }

            return null;
        }
    };

    function logoutUser() {
        localStorage.removeItem('authTokens');
        setAuthTokens(null);
        setUser(null);
        setToastVariant("warning");
        setToastMessage("You’ve been signed out. Please sign in to continue.");
        setShowToast(true);

    }

    const loginUser = async (username, password) => {
        const tokenUrl = API_BASE_URL + '/api/token/'
        const reqOptions = {
            url: tokenUrl,
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                username, password
            },
        };

        try {
            const response = await axios.request(reqOptions);

            const tokens = response.data;
            setAuthTokens(tokens);
            setUser(jwtDecode(tokens.access));
            localStorage.setItem('authTokens', JSON.stringify(tokens));
            setToastVariant("success");
            setToastMessage("Sign in successfull.");
            setShowToast(true);
        } catch (error) {
            if (error.response?.status == 401) {
                setToastVariant("danger");
                setToastMessage("Invalid credentials.");
                setShowToast(true);
            }
            else {
                setToastVariant("danger");
                setToastMessage("Something went wrong");
                setShowToast(true);
            }

            console.log('Login failed', error);
        }
    };




    useEffect(() => {
        const accessToken = authTokens?.access;

        if (accessToken) {
            intervalRef.current = setInterval(() => {
                const decodedToken = jwtDecode(accessToken);
                let leeway_time = 1000 * 60 * 1;
                let time_to_expire = decodedToken.exp * 1000;
                // console.log("Token will expire on " + new Date(time_to_expire).toString());

                let time_rem = time_to_expire - Date.now();
                // console.log("Time remaining is", time_rem / (1000 * 60) + ' mins');

                if (time_rem < leeway_time) {
                    refreshAccessToken(authTokens).then((newTokens) => {
                        let decoded = jwtDecode(newTokens.access);
                        console.log("New Tokens will expire on " + new Date(decoded.exp * 1000).toString());
                        setAuthTokens(newTokens);
                    }).catch((error) => {
                        console.error("Failed to refresh token", error);
                        clearInterval(intervalRef.current); // Clear the interval on failure
                    });
                }

            }, 60 * 1000 * 0.3); // Check every minute

            // Cleanup interval on unmount
            return () => clearInterval(intervalRef.current);
        }
    }, [authTokens]);



    return (
        <AuthContext.Provider value={{
            user, toastMessage, setToastMessage,
            toastVariant, setToastVariant,
            showToast, setShowToast, authTokens, loginUser, logoutUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}

