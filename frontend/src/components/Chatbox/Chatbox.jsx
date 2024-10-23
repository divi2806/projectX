import React, { useState } from "react";
import styles from "./Chatbox.module.css";
import { Send } from "react-feather";


const Chatbox = ({ student, messages, onApprove, onAddMessage }) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      onAddMessage(newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className={styles.chatbox}>
      <h3>Chat with {student.name}</h3>
      <div className={styles.messages}>
        {messages.map((msg) => (
          <div key={msg.id} className={msg.from === "Teacher" ? styles.teacherMsg : styles.aiMsg}>
            <strong>{msg.from}:</strong> {msg.text}
            {msg.from === "AI" && (
              <div className={styles.actions}>
                <button onClick={() => onApprove(msg.id, "approved")}>Approve</button>
                <button onClick={() => onApprove(msg.id, "disapproved")}>Disapprove</button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className={styles.inputArea}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbox;
