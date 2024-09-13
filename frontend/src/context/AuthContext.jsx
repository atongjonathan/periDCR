import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { createContext } from 'react';
import axios from 'axios';

const AuthContext = createContext({});

export default AuthContext;
export const AuthProvider = ({ children }) => {
    let storageAuthTokens = JSON.parse(localStorage.getItem('authTokens'));
    let storageUser = storageAuthTokens ? jwtDecode(storageAuthTokens.access) : null;

    let [user, setUser] = useState(() => storageUser);
    let [authTokens, setAuthTokens] = useState(() => storageAuthTokens);
    let [loading, setLoading] = useState(true);

    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('');
    const [showToast, setShowToast] = useState(false); // New state to control toast visibility

    function saveAuthTokens(authTokenData) {
        setAuthTokens(authTokenData);
        let userData = jwtDecode(authTokenData.access);
        setUser(userData);
        localStorage.setItem('authTokens', JSON.stringify(authTokenData));
    }

    function logoutUser() {
        localStorage.removeItem('authTokens');
        setAuthTokens(null);
        setUser(null);
        setToastVariant("warning");
        setToastMessage("You’ve been signed out. Please sign in to continue.");
        setShowToast(true);
    }

    async function updateToken() {
        if (authTokens) {
            const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;
            const tokenUrl = `${backendBaseUrl}/api/token/refresh/`;
            let refresh = authTokens.refresh;
            const reqOptions = {
                url: tokenUrl,
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    refresh
                },
            };

            try {
                const response = await axios.request(reqOptions);
                if (response) {
                    if (response.status === 200) {
                        let data = response.data;
                        setAuthTokens(data);
                        setUser(jwtDecode(data.access));
                        localStorage.setItem('authTokens', JSON.stringify(data));
                    } else {
                        logoutUser();
                        setToastVariant("danger");
                        setToastMessage("Token refresh failed. Please log in again.");
                        setShowToast(true);
                    }
                }
                else {
                    logoutUser();
                    setToastVariant("danger");
                    setToastMessage("Token refresh failed. Please log in again.");
                    setShowToast(true);
                }


                return response;

            } catch (error) {
                logoutUser();
                setToastVariant("danger");
                setToastMessage("An error occurred during token refresh. Please log in again.");
                setShowToast(true);
                return error;
            } finally {
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        let fourMins = 1000 * 60 * 0.3;

        let interval = setInterval(() => {
            if (authTokens) {
                updateToken();
            }
        }, fourMins);

        // Clear the interval when the component unmounts
        return () => clearInterval(interval);

    }, [authTokens]); // Removed `loading` dependency, keeping only `authTokens`

    let contextData = {
        user,
        authTokens,
        saveAuthTokens,
        logoutUser,
        toastMessage, setToastMessage,
        toastVariant, setToastVariant,
        showToast, setShowToast
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};
