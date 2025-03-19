import StudentTable from "./components/StudentTable";

import React from "react";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  // Check if the user is logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (!isLoggedIn) {
    navigate("/");
    return null; // Prevent content from rendering before redirection
  }

  // Logout Functionality

  return (
    <div className="App">
      <StudentTable />
    </div>
  );
}

export default App;
