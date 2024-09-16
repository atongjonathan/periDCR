import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'

export const Patient = () => {
    const { user } = useContext(AuthContext)
    return (
       <h1>Hello</h1>

    )
}
