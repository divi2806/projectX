import React from "react";
import styles from "./MessageBubble.module.css";
import chatbot from "../../assets/robot.png";
import user from "../../assets/user1.png";
import teacher from "../../assets/teacher.png"; // Add teacher avatar

const MessageBubble = ({ message }) => {
  const isAI = message.from === "ai";
  const isTeacher = message.from === "teacher";

  return (
    <div className={`${styles.messageWrapper} ${
      isAI ? styles.aiMessage : 
      isTeacher ? styles.teacherMessage : 
      styles.userMessage
    }`}>
      {(isAI || isTeacher) && (
        <div className={styles.avatarContainer}>
          <img 
            src={isAI ? chatbot : teacher} 
            alt={isAI ? "AI" : "Teacher"} 
            className={styles.avatar} 
          />
        </div>
      )}
      
      <div className={`${styles.messageContent} ${
        isAI && message.status === 'disapproved' ? styles.disapproved : ''
      }`}>
        {isTeacher && <div className={styles.teacherLabel}>TEACHER:</div>}
        <p className={styles.messageText}>{message.text}</p>
        {isAI && message.status === 'pending' && (
          <span className={styles.pendingTag}>Pending Review</span>
        )}
        {isAI && message.status === 'approved' && (
          <span className={styles.approvedTag}>✓ Approved</span>
        )}
      </div>

      {!isAI && !isTeacher && (
        <div className={styles.avatarContainer}>
          <img src={user} alt="User" className={styles.avatar} />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;