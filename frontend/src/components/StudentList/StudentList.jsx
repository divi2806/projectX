import React from "react";
import styles from "./StudentList.module.css";

const StudentList = ({ students, selectedStudent, onStudentChange }) => {
  return (
    <div className={styles.studentList}>
      <h3>Students</h3>
      <ul>
        {students.map((student) => (
          <li
            key={student.id}
            className={selectedStudent.id === student.id ? styles.selected : ""}
            onClick={() => onStudentChange(student)}
          >
            {student.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentList;
