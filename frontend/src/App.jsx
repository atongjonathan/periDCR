import { React, useEffect } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import "./App.css";
import { Login } from "./components/Login";
import { Home } from "./components/Home";
import { SignUp } from "./components/SignUp";
import { Common } from "./components/Common";
import { PrivateRoute } from "./utils/PrivateRoute"
import { AuthProvider } from "./context/AuthContext";
import { Patient } from "./components/Patient";


function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Home is child of PrivateRoute of which is a placeholder element for validation */}
            <Route path="/" element={<PrivateRoute><Common component={<Home></Home>}></Common></PrivateRoute>}></Route>
            <Route path="/new-patient" element={<PrivateRoute><Common component={<Patient></Patient>}></Common></PrivateRoute>}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
          </Routes>

        </BrowserRouter>
      </AuthProvider>

    </>


  )
}

export default App
