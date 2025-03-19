import React, { useState, useEffect } from "react";
import axios from "axios";

function StudentForm({ fetchStudents, selectedStudent, clearSelection }) {
  const [student, setStudent] = useState({
    name: "",
    roll_number: "",
    class: "",
    section: "",
    attendance: "",
    maths: "",
    science: "",
    english: "",
  });

  useEffect(() => {
    if (selectedStudent) {
      setStudent({
        ...selectedStudent,
        maths: selectedStudent.marks.maths,
        science: selectedStudent.marks.science,
        english: selectedStudent.marks.english,
      });
    }
  }, [selectedStudent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const studentData = {
      ...student,
      marks: {
        maths: parseInt(student.maths),
        science: parseInt(student.science),
        english: parseInt(student.english),
      },
    };

    if (selectedStudent) {
      // Update Student
      await axios.put(
        `http://localhost:8000/students/${selectedStudent.id}`,
        studentData
      );
    } else {
      // Create Student
      await axios.post("http://localhost:8000/students", studentData);
    }

    fetchStudents();
    clearSelection();
    setStudent({
      name: "",
      roll_number: "",
      class: "",
      section: "",
      attendance: "",
      maths: "",
      science: "",
      english: "",
    });
  };

  return (
    <div className="card p-3">
      <h3>{selectedStudent ? "Edit Student" : "Add Student"}</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label>Name:</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={student.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-2">
          <label>Roll Number:</label>
          <input
            type="text"
            className="form-control"
            name="roll_number"
            value={student.roll_number}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-2">
          <label>Class:</label>
          <input
            type="text"
            className="form-control"
            name="class"
            value={student.class}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-2">
          <label>Section:</label>
          <input
            type="text"
            className="form-control"
            name="section"
            value={student.section}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-2">
          <label>Attendance:</label>
          <input
            type="number"
            className="form-control"
            name="attendance"
            value={student.attendance}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-2">
          <label>Maths:</label>
          <input
            type="number"
            className="form-control"
            name="maths"
            value={student.maths}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-2">
          <label>Science:</label>
          <input
            type="number"
            className="form-control"
            name="science"
            value={student.science}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-2">
          <label>English:</label>
          <input
            type="number"
            className="form-control"
            name="english"
            value={student.english}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {selectedStudent ? "Update Student" : "Add Student"}
        </button>
      </form>
    </div>
  );
}

export default StudentForm;
