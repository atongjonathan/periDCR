import { React, useEffect } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import "./App.css";
import { Login } from "./components/Login";
import { Home } from "./components/Home";
import { SignUp } from "./components/SignUp";
import { PrivateRoute } from "./utils/PrivateRoute"
import { AuthProvider } from "./context/AuthContext";


function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Home is child of PrivateRoute of which is a placeholder element for validation */}
            <Route path="/" element={<PrivateRoute isAutheniticated={true}><Home /></PrivateRoute>}></Route>

            <Route path="/login" element={<Login />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
          </Routes>

        </BrowserRouter>
      </AuthProvider>

    </>


  )
}

export default App
