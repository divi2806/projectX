// src/components/TeacherChatbox/TeacherChatbox.js
import React, { useState, useRef, useEffect } from 'react';
import styles from './TeacherChatbox.module.css';
import TeacherMessageBubble from '../TeacherMessageBubble/TeacherMessageBubble';  // Import from correct path

const TeacherChatbox = ({ student, messages, onApprove, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.chatbox}>
      <div className={styles.chatHeader}>
        <div className={styles.studentInfo}>
          <div className={styles.avatar}>
            {student.name.charAt(0).toUpperCase()}
          </div>
          <div className={styles.info}>
            <h3>{student.name}</h3>
            <span className={styles.email}>{student.email}</span>
          </div>
        </div>
      </div>

      <div className={styles.messagesContainer}>
        {messages.map((message) => (
          <TeacherMessageBubble
            key={message._id}
            message={message}
            onApprove={onApprove}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputArea}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className={styles.messageInput}
        />
        <button 
          className={styles.sendButton}
          onClick={handleSend}
          disabled={!newMessage.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default TeacherChatbox;