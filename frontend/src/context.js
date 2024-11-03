import React, { createContext, useContext, useRef, useState, useEffect } from "react";
import { auth } from "./firebase";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const lastMsg = useRef();
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadMessages = async () => {
      if (!userId) return;
      
      try {
        const response = await fetch(`http://localhost:5500/messages/${userId}`);
        const data = await response.json();
        
        // Filter out disapproved AI messages
        const filteredMessages = data.filter(msg => 
          msg.from !== 'ai' || msg.status !== 'disapproved'
        );
        
        if (filteredMessages.length > 0) {
          setMessages(filteredMessages);
        } else {
          setMessages([{
            from: "ai",
            text: "Hi there! I'm your tutor, I'm here to help you out with your questions. Ask me anything you want.",
            status: 'approved'
          }]);
        }
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };

    loadMessages();
  }, [userId]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setMessages([{
          from: "ai",
          text: "Hi there! I'm your tutor, I'm here to help you out with your questions. Ask me anything you want.",
          status: 'approved'
        }]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmission = async () => {
    if (!messageText.trim() || processing || !userId) return;

    const tempMessages = [
      ...messages,
      {
        from: "human",
        text: messageText,
      },
    ];

    setMessages(tempMessages);
    setMessageText("");

    setTimeout(() => lastMsg.current?.scrollIntoView({ behavior: "smooth" }));

    try {
      setProcessing(true);
      
      const res = await fetch(`http://localhost:5500/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userQuery: messageText,
          userId,
        }),
      });
      
      const data = await res.json();
      
      setProcessing(false);

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            from: "ai",
            text: data.data.trim(),
            status: 'pending'
          },
        ]);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          from: "ai",
          text: "Error processing this message. Please try again later.",
          status: 'approved'
        },
      ]);
      setProcessing(false);
    }

    setTimeout(() => lastMsg.current?.scrollIntoView({ behavior: "smooth" }));
  };

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
        userId,
      }}
    >
      { children}
    </AppContext.Provider>
  );
};

export default AppProvider;
export const useGlobalContext = () => useContext(AppContext);