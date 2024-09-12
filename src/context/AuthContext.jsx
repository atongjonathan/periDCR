import { jwtDecode } from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { createContext } from 'react'
import axios from 'axios'


const AuthContext = createContext({})

export default AuthContext
export const AuthProvider = ({ children }) => {
    let storageAuthTokens = JSON.parse(localStorage.getItem('authTokens'))
    let storageUser = storageAuthTokens ? jwtDecode(storageAuthTokens.access) : null

    let [user, setUser] = useState(() => storageUser); // Value is set once on initial load and not every time te provider is being used
    let [authTokens, setAuthTokens] = useState(() => storageAuthTokens);
    let [loading, setLoading] = useState(true)



    function saveAuthTokens(authTokenData) {
        setAuthTokens(authTokenData)
        let userData = jwtDecode(authTokenData.access)
        setUser(userData)
        localStorage.setItem('authTokens', JSON.stringify(authTokenData))


    }

    function logoutUser() {
        localStorage.removeItem('authTokens')
        setAuthTokens(null)
        setUser(null)
    }


    async function updateToken() {
        if (authTokens) {
            const backendBaseUrl = import.meta.env.VITE_BACKEND_URL
            const tokenUrl = `${backendBaseUrl}/api/token/refresh/`
            let refresh = authTokens.refresh
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
                // const response = await fetch(tokenUrl, reqOptions)
                if (response.status == 200) {
                    let data = response.data
                    setAuthTokens(data)
                    setUser(jwtDecode(data.access))
                    localStorage.setItem('authTokens', JSON.stringify(data))
                }
                else {
                    logoutUser()
                }

                return response;

            } catch (error) {

                logoutUser()
                return error;
            }
            finally {
                setLoading(false) // Always set loading to false after token attempt
            }
        }


    }

    useEffect(() => {
        if (loading) {
            updateToken()
            console.log("Initial update")
        }
        let fourMins = 1000 * 60 * 4

        let interval = setInterval(() => {
            if (authTokens) {
                updateToken()
            }
        }, fourMins)
        return () => clearInterval(interval)

    }, [authTokens, loading])
    let contextData = {
        user,
        authTokens,
        saveAuthTokens,
        logoutUser
    }
    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )

}