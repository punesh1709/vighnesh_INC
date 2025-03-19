import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const StudentTable = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [showModal, setShowModal] = useState(false);
  const [studentData, setStudentData] = useState({
    id: "",
    name: "",
    roll_number: "",
    class: "",
    section: "",
    attendance: "",
    marks: { maths: "", science: "", english: "" },
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8000/students")
      .then((response) => setStudents(response.data))
      .catch((error) => console.error("Error fetching student data:", error));
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8000/students/${id}`)
          .then(() => {
            setStudents((prev) => prev.filter((student) => student.id !== id));
            console.log("Deleting student ID:", id);  // Debug log
            Swal.fire("Deleted!", "The student has been deleted.", "success");
          })
          .catch(() => {
            console.log("Deleting student ID:", id);  // Debug log
            Swal.fire("Error", "Failed to delete student.", "error");
          });
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("marks.")) {
      const markField = name.split(".")[1];
      setStudentData((prevData) => ({
        ...prevData,
        marks: { ...prevData.marks, [markField]: value },
      }));
    } else {
      setStudentData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const classOptions = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"];
const sectionOptions = ["A", "B", "C", "D", "E"];


  const handleSubmit = () => {
    if (!studentData.name || !studentData.roll_number) {
      Swal.fire("Error", "Name and Roll Number are required", "error");
      return;
    }

    if (isEditing) {
      axios
        .put(`http://localhost:8000/students/${studentData.id}`, studentData)
        .then(() => {
          setStudents((prev) =>
            prev.map((student) =>
              student.id === studentData.id ? studentData : student
            )
          );
          Swal.fire("Success", "Student updated successfully!", "success");
        })
        .catch(() => Swal.fire("Error", "Failed to update student", "error"));
    } else {
      axios
        .post("http://localhost:8000/students", studentData)
        .then((response) => {
          setStudents([...students, response.data]);
          Swal.fire("Success", "Student added successfully!", "success");
        })
        .catch(() => Swal.fire("Error", "Failed to add student", "error"));
    }

    setShowModal(false);
    setStudentData({
      id: "",
      name: "",
      roll_number: "",
      class: "",
      section: "",
      attendance: "",
      marks: { maths: "", science: "", english: "" },
    });
  };

  const handleEdit = (student) => {
    setIsEditing(true);
    setStudentData(student);
    setShowModal(true);
  };

  const handleAdd = () => {
    setIsEditing(false);
    setStudentData({
      id: "",
      name: "",
      roll_number: "",
      class: "",
      section: "",
      attendance: "",
      marks: { maths: "", science: "", english: "" },
    });
    setShowModal(true);
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
      student.roll_number?.toString().includes(searchTerm.trim())
  );

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

  <button className="btn btn-success mb-4" onClick={handleAdd}>
    Add Student
  </button>

  {/* Search Input */}
  <input
    type="text"
    placeholder="Search by Name or Roll Number"
    className="form-control mb-3"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  {/* Responsive Table */}
  <div className="table-responsive">
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
          <th>Actions</th>
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
            <td>
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => handleEdit(student)}
              >
                Edit
              </button>

              <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={() => handleDelete(student.id)}
                  >
                    Delete
                  </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {showModal && (
    <div className="modal show d-block">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {isEditing ? "Edit Student" : "Add Student"}
            </h5>
            <button
              className="btn-close"
              onClick={() => setShowModal(false)}
            ></button>
          </div>
          <div className="modal-body">
            <input
              name="name"
              className="form-control mb-2"
              placeholder="Name"
              value={studentData.name}
              onChange={handleInputChange}
            />
            <input
              name="roll_number"
              className="form-control mb-2"
              placeholder="Roll Number"
              value={studentData.roll_number}
              onChange={handleInputChange}
            />
            <input
              name="class"
              className="form-control mb-2"
              placeholder="Class"
              value={studentData.class}
              onChange={handleInputChange}
            />
            <input
              name="section"
              className="form-control mb-2"
              placeholder="Section"
              value={studentData.section}
              onChange={handleInputChange}
            />
            <input
              name="attendance"
              className="form-control mb-2"
              placeholder="Attendance (%)"
              value={studentData.attendance}
              onChange={handleInputChange}
            />
            <input
              name="marks.maths"
              className="form-control mb-2"
              placeholder="Marks (Maths)"
              value={studentData.marks.maths}
              onChange={handleInputChange}
            />
            <input
              name="marks.science"
              className="form-control mb-2"
              placeholder="Marks (Science)"
              value={studentData.marks.science}
              onChange={handleInputChange}
            />
            <input
              name="marks.english"
              className="form-control mb-2"
              placeholder="Marks (English)"
              value={studentData.marks.english}
              onChange={handleInputChange}
            />
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" onClick={handleSubmit}>
              Save
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )}

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
