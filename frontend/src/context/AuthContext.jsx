import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { createContext } from 'react';
import axios from 'axios';

const AuthContext = createContext({});
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Create Axios instance
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});
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



    let [fullName, setFullName] = useState(() => {
        return `${user?.first_name ?? ''}${user?.last_name ? ' ' + user.last_name : ''}`;
    });

    let [avatarUrl, setAvatarUrl] = useState(() => {
        return user
            ? `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&rounded=true&background=95eec5&size=35`
            : 'https://ui-avatars.com/api/?name=User&rounded=true&background=95eec5&size=35';
    });


    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('');
    const [showToast, setShowToast] = useState(false); // New state to control toast visibility


    useEffect(() => {
        const attachToken = async (config) => {
            const accessToken = authTokens?.access;
            if (accessToken) {
                const decodedToken = jwtDecode(accessToken);
                const isExpired = decodedToken.exp * 1000 < Date.now();

                // If token is expired, attempt to refresh
                if (isExpired) {
                    const newTokens = await refreshAccessToken();
                    if (newTokens) {
                        config.headers['Authorization'] = `Bearer ${newTokens.access}`;
                    }
                } else {
                    config.headers['Authorization'] = `Bearer ${accessToken}`;
                }
            }
            return config;
        };

        // Add request interceptor
        axiosInstance.interceptors.request.use(attachToken, (error) => {
            return Promise.reject(error);
        });

    }, [authTokens]);

    // Refresh token function
    const refreshAccessToken = async () => {
        console.log("Token Refreshed")
        try {
            const response = await axiosInstance.post('/api/token/refresh/', {
                refresh: authTokens?.refresh,
            });

            const newTokens = response.data;
            setAuthTokens(newTokens);
            setUser(jwtDecode(newTokens.access));
            localStorage.setItem('authTokens', JSON.stringify(newTokens));

            return newTokens;
        } catch (error) {
            console.error('Failed to refresh token', error);
            logoutUser();
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
        axiosInstance.defaults.headers['Authorization'] = null;

    }

    const loginUser = async (username, password) => {
        try {
            const response = await axiosInstance.post('/api/token/', {
                username,
                password,
            });

            const tokens = response.data;
            setAuthTokens(tokens);
            setUser(jwtDecode(tokens.access));
            localStorage.setItem('authTokens', JSON.stringify(tokens));
        } catch (error) {
            console.error('Login failed', error);
        }
    };



    return (
        <AuthContext.Provider value={{
            user, toastMessage, setToastMessage,
            toastVariant, setToastVariant,
            showToast, setShowToast, authTokens, loginUser, logoutUser, avatarUrl
        }}>
            {children}
        </AuthContext.Provider>
    );
};
