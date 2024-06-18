import React, { useEffect, useState } from "react";
import axios from "axios";

const LoanApproval = ({ token }) => {
  // console.log(token)
  const [pendingLoans, setPendingLoans] = useState([]);

  useEffect(() => {
    const fetchPendingLoans = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/loans/pending",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // console.log(response.data)
        setPendingLoans(response.data);
      } catch (error) {
        console.error("Error fetching pending loans:", error);
      }
    };

    fetchPendingLoans();
  }, [token]);

  const handleApproveLoan = async (loanId) => {
    try {
      await axios.post(
        `http://localhost:5000/loans/${loanId}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Update the local state to reflect the approved loan
      setPendingLoans(pendingLoans.filter((loan) => loan._id !== loanId));
    } catch (error) {
      console.error("Error approving loan:", error);
    }
  };

  return (
    <div>
      <h2 className="loanheading">Pending Loans</h2>
      {pendingLoans.length === 0 ? (
        <p className="loanheading">No pending loans to approve</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Term</th>
              <th>Requsted By</th>
            </tr>
          </thead>
          <tbody>
            {pendingLoans.map((loan) => (
              <tr key={loan._id}>
                <td>{loan.amount}</td>
                <td>{loan.term} weeks</td>
                <td>{loan.userId}</td>
                <button
                  className="approvebtn"
                  onClick={() => handleApproveLoan(loan._id)}
                >
                  Approve
                </button>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LoanApproval;
