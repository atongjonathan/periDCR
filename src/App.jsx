import { React, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import "./App.css";
import { Login } from "./components/Login";
import { SignUp } from "./components/SignUp";
function App() {
  return (
    <>
      <BrowserRouter>{/* Decides what component to load based on the url */}
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
        </Routes>

      </BrowserRouter>
    </>


  )
}

export default App
