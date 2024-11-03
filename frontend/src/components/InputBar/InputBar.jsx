import React from "react";
import styles from "./InputBar.module.css";
import { Send } from "react-feather";
import { useGlobalContext } from "../../context";

const InputBar = () => {
  const { messageText, setMessageText, handleSubmission } = useGlobalContext();

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmission();
    }
  };

  return (
    <div className={styles.footer}>
      <input
        placeholder="Type here..."
        value={messageText}
        onChange={(event) => setMessageText(event.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button 
        className={styles.btn} 
        onClick={handleSubmission}
        disabled={!messageText.trim()}
      >
        <div className={styles.icon}>
          <Send />
        </div>
      </button>
    </div>
  );
};

export default InputBar;