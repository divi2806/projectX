// context.js
import React, { createContext, useContext, useRef, useState } from "react";

// Create the context
const AppContext = createContext();

// Define the AppProvider which manages the chatbox state and handles the message submission
const AppProvider = ({ children }) => {
  const lastMsg = useRef(); // To scroll to the last message automatically
  const [messageText, setMessageText] = useState(""); // Store the text in the input field
  const [messages, setMessages] = useState([
    {
      from: "ai",
      text: "Hi there! I'm your tutor, I'm here to help you out with your questions. Ask me anything you want.",
    },
  ]); // Array to store chat messages
  const [processing, setProcessing] = useState(false); // Flag to indicate if the query is being processed

  // Function to handle submission of user messages
  const handleSubmission = async () => {
    if (!messageText.trim() || processing) return; // Prevent empty or repeated submissions

    const tempMessages = [
      ...messages,
      {
        from: "human",
        text: messageText,
      },
    ];

    setMessages(tempMessages); // Update the chat messages with the new user input
    setMessageText(""); // Clear the input field

    // Automatically scroll to the last message after submission
    setTimeout(() =>
      lastMsg.current.scrollIntoView({
        behavior: "smooth",
      })
    );

    try {
      setProcessing(true);
      
      // Sending the user query to the backend server, which then forwards it to the Python backend
      const res = await fetch(`https://pdh-school-complete.onrender.com/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userQuery: messageText, // Pass the user query
        }),
      });
      
      setProcessing(false);

      const data = await res.json();
      const ans = data.data;

      // Update the chat with the AI's response
      setMessages((prev) => [
        ...prev,
        {
          from: "ai",
          text: ans.trim(),
        },
      ]);
    } catch (err) {
      const error = "Error processing this message. Please try again later.";
      
      // Handle errors by displaying an error message in the chat
      setMessages((prev) => [
        ...prev,
        {
          from: "ai",
          text: error,
        },
      ]);
    }

    // Scroll to the last message after receiving the response
    setTimeout(() =>
      lastMsg.current.scrollIntoView({
        behavior: "smooth",
      })
    );
  };

  // Providing the context values to the rest of the application
  return (
    <AppContext.Provider
      value={{
        lastMsg,
        messageText,
        setMessageText,
        processing,
        setProcessing,
        messages,
        setMessages,
        handleSubmission,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;

// Hook to use the global context in other components
export const useGlobalContext = () => {
  return useContext(AppContext);
};
