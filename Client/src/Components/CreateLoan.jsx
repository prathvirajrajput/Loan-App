import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateLoan = ({ token }) => {
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("");

  const handleCreateLoan = async () => {
    try {
      await axios.post(
        "http://localhost:5000/loans",
        { amount, term },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast("Loan Created");
    } catch (error) {
      console.log("error", error.response.status);
      alert("error creating loan:" + error.response.data);
    }
    setAmount("");
    setTerm("");
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
            <h2>Create Loan</h2>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
            />
            <input
              type="number"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Term (weeks)"
            />
            <button onClick={handleCreateLoan}>Create Loan</button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default CreateLoan;
