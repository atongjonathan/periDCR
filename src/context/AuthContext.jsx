import { jwtDecode } from 'jwt-decode'
import React, { useState } from 'react'
import { createContext } from 'react'

const AuthContext = createContext({})

export default AuthContext
export const AuthProvider = ({ children }) => {
    let storageAuthTokens = JSON.parse(localStorage.getItem('authTokens'))
    let storageUser = storageAuthTokens ? jwtDecode(storageAuthTokens.access) : null

    let [user, setUser] = useState(() => storageUser); // Value is set once on initial load and not every time te provider is being used
    let [authTokens, setAuthTokens] = useState(() => storageAuthTokens);



    function saveAuthTokens(authTokenData) {
        setAuthTokens(authTokenData)
        let userData = jwtDecode(authTokenData.access)
        setUser(userData)
        localStorage.setItem('authTokens', JSON.stringify(authTokenData))


    }
    let contextData = {
        user,
        authTokens,
        saveAuthTokens,
        logoutUser
    }

    function logoutUser() {
        localStorage.removeItem('authTokens')
        setAuthTokens(null)
        setUser(null)
    }


    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )

}