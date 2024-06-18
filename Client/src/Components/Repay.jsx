import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Repay = ({ token }) => {
  const [loanId, setLoanId] = useState("");
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();

  const handleRepay = async () => {
    await axios.post(
      "http://localhost:5000/repayments",
      { loanId, amount },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    navigate("/Loans");
    toast(`Repayment Done succesfully`);
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
            <h2>Repay Loan</h2>
            <input
              type="text"
              value={loanId}
              onChange={(e) => setLoanId(e.target.value)}
              placeholder="Loan ID"
            />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
            />
            <button onClick={handleRepay}>Repay</button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Repay;
