import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Loans = ({ token }) => {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    const fetchLoans = async () => {
      const response = await axios.get("http://localhost:5000/loans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log(response.data)
      setLoans(response.data);
    };
    fetchLoans();
  }, [token]);

  return (
    <>
      <div className="Tablecontainer">
        <motion.h2 initial={{ x: -100 }} animate={{ x: 0 }} className="title">
          My Loans
        </motion.h2>
        <table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Term</th>
              <th>LoanId</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan._id}>
                <td>{loan.amount}</td>
                <td>{loan.term}</td>
                <td>{loan._id}</td>
                <td>{loan.state}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Loans;
