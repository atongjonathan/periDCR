import { React, useEffect } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import "./App.css";
import { Login } from "./components/Login";
import { Home } from "./components/Home";
import { SignUp } from "./components/SignUp";
import { Common } from "./components/Common";
import { PrivateRoute } from "./utils/PrivateRoute"
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { NewPatient } from "./components/NewPatient";
import { Patient } from "./components/Patient";
import { Patients } from "./components/Patients";
import { MessageProvider } from "./context/MessageContext";
import { Stocks } from "./components/Stocks";
import { Stock } from "./components/Stock";

function App() {
  return (
    <>
      <AuthProvider>
        <UserProvider>
          <MessageProvider>
            <BrowserRouter>
              <Routes>
                {/* Home is child of PrivateRoute of which is a placeholder element for validation */}
                <Route path="/" element={<PrivateRoute><Common component={<Home></Home>}></Common></PrivateRoute>}></Route>
                <Route path="/new-patient" element={<PrivateRoute><Common component={<NewPatient></NewPatient>}></Common></PrivateRoute>}></Route>
                <Route path="/patient/:id" element={<PrivateRoute><Common component={<Patient></Patient>}></Common></PrivateRoute>}></Route>
                <Route path="/patient" element={<PrivateRoute><Common component={<Patients></Patients>}></Common></PrivateRoute>}></Route>
                <Route path="/stock" element={<PrivateRoute><Common component={<Stocks></Stocks>}></Common></PrivateRoute>}></Route>
                <Route path="/stock/:id" element={<PrivateRoute><Common component={<Stock></Stock>}></Common></PrivateRoute>}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/signup" element={<SignUp />}></Route>
              </Routes>

            </BrowserRouter>
          </MessageProvider>
        </UserProvider>

      </AuthProvider>

    </>


  )
}

export default App
