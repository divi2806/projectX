import React, { useState } from "react";
import styles from "./TeacherPanel.module.css";
import StudentList from "../../components/StudentList/StudentList";
import Chatbox from "../../components/Chatbox/Chatbox";

const studentsData = [
  { id: 1, name: "Ram" },
  { id: 2, name: "Raman" },
  { id: 3, name: "Ravi" },
  { id: 4, name: "Radha" },
];

const TeacherPanel = () => {
  const [selectedStudent, setSelectedStudent] = useState(studentsData[0]);

  const initialMessages = {
    Ram: [
      { id: 1, from: "AI", text: "Hello Ram, how can I help you today?", status: "pending" },
      { id: 2, from: "Ram", text: "Can you tell all the vowels?", status: "approved" },
      { id: 3, from: "AI", text: "Vowels are A,E,I,O,U.", status: "pending" },
    ],
    Raman: [
      { id: 1, from: "AI", text: "Hello Raman, what would you like to learn?", status: "pending" },
      { id: 2, from: "Raman", text: "What is the capital of France?", status: "approved" },
      { id: 3, from: "AI", text: "The capital of France is Paris.", status: "pending" },
    ],
    Ravi: [
      { id: 1, from: "AI", text: "Hi Ravi, how can I assist you?", status: "pending" },
      { id: 2, from: "Ravi", text: "What is 2+2?", status: "approved" },
      { id: 3, from: "AI", text: "2+2 is 4.", status: "pending" },
    ],
    Radha: [
      { id: 1, from: "AI", text: "Hi Radha, do you have any questions?", status: "pending" },
      { id: 2, from: "Radha", text: "Explain photosynthesis.", status: "approved" },
      { id: 3, from: "AI", text: "Photosynthesis is the process by which plants make food.", status: "pending" },
    ],
  };

  const [messages, setMessages] = useState(initialMessages[selectedStudent.name]);

  const handleStudentChange = (student) => {
    setSelectedStudent(student);
    setMessages(initialMessages[student.name]);
  };

  const handleApproval = (messageId, action) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, status: action } : msg
      )
    );

    if (action === "disapproved") {
      alert("This message has been disapproved.");
    } else if (action === "approved") {
      alert("This message has been approved.");
    }
  };

  const handleNewMessage = (newMessage) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: prevMessages.length + 1, from: "Teacher", text: newMessage, status: "approved" },
    ]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <StudentList
          students={studentsData}
          selectedStudent={selectedStudent}
          onStudentChange={handleStudentChange}
        />
      </div>
      <div className={styles.chatArea}>
        <Chatbox
          student={selectedStudent}
          messages={messages}
          onApprove={handleApproval}
          onAddMessage={handleNewMessage}
        />
      </div>
    </div>
  );
};

export default TeacherPanel;
