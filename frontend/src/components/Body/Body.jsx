import React from "react";
import styles from "./Body.module.css";
import { useGlobalContext } from "../../context";
import MessageBubble from "../MessageBubble/MessageBubble";  // Import from correct path

const Body = () => {
  const { messages, processing, lastMsg } = useGlobalContext();

  return (
    <div className={styles.bodycontainer}>
      {messages.map((msg, index) => {
        // Only show approved AI messages or non-AI messages
        if (msg.from === "ai" && msg.status === "disapproved") return null;
        
        return <MessageBubble key={index} message={msg} />;
      })}

      {processing && (
        <div className={styles.typing}>
          <div className={styles.dot} />
          <div className={styles.dot} />
          <div className={styles.dot} />
        </div>
      )}

      <div ref={lastMsg} />
    </div>
  );
};

export default Body;