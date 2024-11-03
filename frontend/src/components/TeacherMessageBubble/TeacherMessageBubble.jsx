import React from "react";
import styles from "./TeacherMessageBubble.module.css";

const TeacherMessageBubble = ({ message, onApprove }) => {
  const isAI = message.from === "ai";
  const isTeacher = message.from === "teacher";

  return (
    <div className={`${styles.messageWrapper} ${
      isAI ? styles.aiMessage :
      isTeacher ? styles.teacherMessage :
      styles.userMessage
    }`}>
      <div className={styles.messageContent}>
        {isTeacher && <div className={styles.teacherLabel}>TEACHER:</div>}
        <p className={styles.messageText}>{message.text}</p>
        
        {isAI && (
          <div className={styles.controls}>
            <button
              className={`${styles.controlButton} ${
                message.status === 'approved' ? styles.active : ''
              }`}
              onClick={() => onApprove(message._id, 'approved')}
            >
              ✓
            </button>
            <button
              className={`${styles.controlButton} ${
                message.status === 'disapproved' ? styles.active : ''
              }`}
              onClick={() => onApprove(message._id, 'disapproved')}
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherMessageBubble;