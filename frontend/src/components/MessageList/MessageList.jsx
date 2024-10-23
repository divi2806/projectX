import React from "react";
import styles from "./MessageList.module.css";

const MessageList = ({ messages, onApprove }) => {
  return (
    <div className={styles.messageList}>
      {messages.map((msg) => (
        <div key={msg.id} className={styles.message}>
          <span>{msg.from}: {msg.text}</span>
          {msg.status === "pending" && (
            <div className={styles.actions}>
              <button onClick={() => onApprove(msg.id, "approved")}>Approve</button>
              <button onClick={() => onApprove(msg.id, "disapproved")}>Disapprove</button>
            </div>
          )}
          {msg.status === "approved" && <span className={styles.approved}>Approved</span>}
          {msg.status === "disapproved" && <span className={styles.disapproved}>Disapproved</span>}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
