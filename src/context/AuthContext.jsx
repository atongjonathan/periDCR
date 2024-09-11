import React, { useState } from 'react'
import { createContext } from 'react'

const AuthContext = createContext({})

export default AuthContext
export const AuthProvider = ({ children }) => {
    
    let [user, setUser] = useState(null);
    let [authTokens, setAuthTokens] = useState(null);

    let contextData  = {
        user: user,
        authTokens: authTokens,
    }


    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )

}