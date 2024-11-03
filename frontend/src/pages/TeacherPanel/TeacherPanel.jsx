import React, { useState, useEffect } from "react";
import styles from "./TeacherPanel.module.css";
import StudentList from "../../components/StudentList/StudentList";
import TeacherChatbox from "../../components/TeacherChatbox/TeacherChatbox";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const TeacherPanel = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      fetchMessages(selectedStudent.uid);
    }
  }, [selectedStudent]);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:5500/students');
      const data = await response.json();
      setStudents(data);
      if (data.length > 0) setSelectedStudent(data[0]);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch students');
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5500/messages/${userId}`);
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError('Failed to fetch messages');
    }
  };

  const handleApproval = async (messageId, status) => {
    try {
      await fetch(`http://localhost:5500/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (selectedStudent) {
        fetchMessages(selectedStudent.uid);
      }
    } catch (err) {
      setError('Failed to update message status');
    }
  };

  const handleSendMessage = async (text) => {
    try {
      await fetch('http://localhost:5500/teacher-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          studentId: selectedStudent.uid,
        }),
      });
      if (selectedStudent) {
        fetchMessages(selectedStudent.uid);
      }
    } catch (err) {
      setError('Failed to send message');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <StudentList
          students={students}
          selectedStudent={selectedStudent}
          onStudentSelect={setSelectedStudent}
        />
      </div>
      <div className={styles.chatArea}>
        {selectedStudent && (
          <TeacherChatbox
            student={selectedStudent}
            messages={messages}
            onApprove={handleApproval}
            onSendMessage={handleSendMessage}
          />
        )}
      </div>
    </div>
  );
};

export default TeacherPanel;