import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const handleRegister = async () => {
    await axios.post("http://localhost:5000/register", {
      username,
      password,
      isAdmin,
    });
    // localStorage.setItem('admin', JSON.stringify(isAdmin));
    toast(`${username} Register Successfully`);
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
            <h2>Register</h2>
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
            <label>
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
              <span> Admin</span>
            </label>
            <button onClick={handleRegister}>Register</button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Register;
