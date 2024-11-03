import React from "react";
import styles from "./StudentList.module.css";

const StudentList = ({ students, selectedStudent, onStudentSelect }) => {
  return (
    <div className={styles.studentList}>
      <div className={styles.header}>
        <h3>Students ({students.length})</h3>
        <div className={styles.searchBox}>
          <input 
            type="search" 
            placeholder="Search students..."
            className={styles.searchInput}
          />
        </div>
      </div>
      
      <div className={styles.listContainer}>
        {students.length === 0 ? (
          <div className={styles.emptyState}>
            No students found
          </div>
        ) : (
          <ul>
            {students.map((student) => (
              <li
                key={student.uid}
                className={`${styles.studentItem} ${
                  selectedStudent?.uid === student.uid ? styles.selected : ""
                }`}
                onClick={() => onStudentSelect(student)}
              >
                <div className={styles.studentInfo}>
                  <div className={styles.avatar}>
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.details}>
                    <span className={styles.studentName}>{student.name}</span>
                    <span className={styles.studentEmail}>{student.email}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StudentList;