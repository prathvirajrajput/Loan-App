import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await axios.post("http://localhost:5000/login", {
      username,
      password,
    });
    // console.log(response.data.token);
    const { token, user } = response.data;
    setToken(token);
    if (user.isAdmin) {
      navigate("/LoanApproval");
    } else {
      navigate("/Loans");
    }

    toast(`${username} LogIn Successfully`);

    setUsername("");
    setPassword("");
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        // hideProgressBar={false}
        Transition="zoom"
        closeOnClick
        pauseOnHover
        theme="light"
      />

      <motion.div
        className="maincon"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
      >
        <div className="subcontainer">
          <div className="formcontainer">
            <h2>Login</h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button onClick={handleLogin}>Login</button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Login;
