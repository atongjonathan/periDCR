import React, { useState } from 'react'
import { createContext } from 'react'

const AuthContext = createContext({})

export default AuthContext
export const AuthProvider = ({ children }) => {

    let [user, setUser] = useState(null);
    let [authTokens, setAuthTokens] = useState(null);

    function saveUser(user) {
        setUser(user)
    }

    function saveAuthTokens() {
        setAuthTokens(tokens)

    }
    let contextData = {
        user,
        authTokens,
        saveUser,
        saveAuthTokens
    }


    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )

}