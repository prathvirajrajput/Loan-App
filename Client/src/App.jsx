import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import CreateLoan from "./Components/CreateLoan";
import Loans from "./Components/Loans";
import Repay from "./Components/Repay";
import LoanApproval from "./Components/LoanApproval";

const App = () => {
  const [token, setToken] = useState("");
  //  console.log(token)

  return (
    <Router>
      <div className="container">
        <nav className="navbar">
          <Link className="navlink" to="/">
            Register
          </Link>
          <Link className="navlink" to="/login">
            Login
          </Link>
          <Link className="navlink" to="/create-loan">
            Create Loan
          </Link>
          <Link className="navlink" to="/loans">
            My Loans
          </Link>
          <Link className="navlink" to="/repay">
            Repay
          </Link>
        </nav>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/create-loan" element={<CreateLoan token={token} />} />
          <Route path="/loans" element={<Loans token={token} />} />
          <Route path="/repay" element={<Repay token={token} />} />
          <Route
            path="/LoanApproval"
            element={<LoanApproval token={token} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
