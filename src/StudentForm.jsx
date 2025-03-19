import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const StudentTable = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    axios
      .get("http://localhost:8000/students")
      .then((response) => setStudents(response.data))
      .catch((error) => console.error("Error fetching student data:", error));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  // Filtered students based on search
  const filteredStudents = students.filter((student) => {
    const nameMatch = student.name
      ?.toLowerCase()
      .includes(searchTerm.trim().toLowerCase());
    const rollNumberMatch = student.roll_number
      ?.toString()
      .includes(searchTerm.trim());
    return nameMatch || rollNumberMatch;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStudents.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  // Pagination buttons logic (show only limited buttons)
  const maxVisiblePages = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  return (
    <div className="container mt-5">
  <div className="d-flex justify-content-between mb-4">
    <h2 className="mb-4">Student Data</h2>
    <button className="btn btn-danger" onClick={handleLogout}>
      Logout
    </button>
  </div>

  {/* Search Input */}
  <input
    type="text"
    placeholder="Search by Name or Roll Number"
    className="form-control mb-3"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

    <table className="table table-bordered table-striped">
      <thead className="table-dark">
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Roll Number</th>
          <th>Class</th>
          <th>Section</th>
          <th>Attendance (%)</th>
          <th>Marks (Maths)</th>
          <th>Marks (Science)</th>
          <th>Marks (English)</th>
        </tr>
      </thead>
      <tbody>
        {currentItems.map((student) => (
          <tr key={student.id}>
            <td>{student.id}</td>
            <td>{student.name}</td>
            <td>{student.roll_number}</td>
            <td>{student.class}</td>
            <td>{student.section}</td>
            <td>{student.attendance}%</td>
            <td>{student.marks.maths}</td>
            <td>{student.marks.science}</td>
            <td>{student.marks.english}</td>
          </tr>
        ))}
      </tbody>
    </table>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center">
        {startPage > 1 && (
            <button
            className="btn btn-primary mx-1"
            onClick={() => setCurrentPage(1)}
          >
            1
            </button>
        )}

        {startPage > 2 && <span className="mx-1">...</span>}

        {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
            <button
            key={startPage + index}
            className={`btn btn-primary mx-1 ${
              currentPage === startPage + index ? "active" : ""
            }`}
            onClick={() => setCurrentPage(startPage + index)}
            >
            {startPage + index}
            </button>
        ))}

        {endPage < totalPages - 1 && <span className="mx-1">...</span>}

        {endPage < totalPages && (
          <button
            className="btn btn-primary mx-1"
            onClick={() => setCurrentPage(totalPages)}
          >
            {totalPages}
          </button>
        )}
      </div>
      
</div>
  );
};

export default StudentTable;
