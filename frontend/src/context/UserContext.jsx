import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import AuthContext from './AuthContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const { user, authTokens, logoutUser } = useContext(AuthContext); // Get user from AuthContext
    const [periUser, setPeriUser] = useState("Jona"); // Store user data from backend
    const [userLoading, setUserLoading] = useState(true); // Loading state to track API call

    useEffect(() => {
        async function getUser() {
            const getUserUrl = BACKEND_URL + '/api/users/' + user?.user_id
            if (user) { // Ensure that user exists before making the request
                let reqOptions = {
                    method: 'GET',
                    url: getUserUrl,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + authTokens?.access,
                    },
                };

                try {
                    const response = await axios.request(reqOptions);
                    let data = response.data
                    data.avatarUrl = `https://ui-avatars.com/api/?name=${data.first_name}+${data.last_name}&rounded=true&background=95eec5&size=35`
                    data.fullName = data.first_name + '  ' + data.last_name
                    setPeriUser(data); // Set the fetched user data
                } catch (error) {
                    logoutUser()
                    console.log(error); // Log any error
                } finally {
                    setUserLoading(false); // Set loading to false after the request completes
                }
            }
        }

        getUser(); // Call the function to fetch user data
    }, [user]); // Re-run the effect when `user` changes

    return (
        <UserContext.Provider value={{ periUser, userLoading }}>
            {children}
        </UserContext.Provider>
    );
};
