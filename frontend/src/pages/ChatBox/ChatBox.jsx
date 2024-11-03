import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import Title from "../../components/Title/Title";
import InputBar from "../../components/InputBar/InputBar";
import Body from "../../components/Body/Body";
import styles from "./ChatBox.module.css";
import { ThreeCircles } from "react-loader-spinner";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useGlobalContext } from "../../context";

const ChatBox = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const { setMessages } = useGlobalContext();

  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserName(user.displayName || "User");
        // Create or update user in MongoDB
        fetch('http://localhost:5500/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: user.uid,
            name: user.displayName || "User",
            email: user.email,
            role: 'student'
          })
        });
      } else {
        navigate("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const signOutHandler = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setMessages([{
        from: "ai",
        text: "Hi there! I'm your tutor, I'm here to help you out with your questions. Ask me anything you want.",
        status: 'approved'
      }]);
      alert("Signed out successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Sign out error:", err.message);
      alert("Error signing out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className={styles.loadContainer}>
          <ThreeCircles
            height="50"
            width="50"
            color="#046cf1"
            visible={true}
            ariaLabel="three-circles-rotating"
          />
        </div>
      );
    }

    return (
      <div className={styles.chatContainer}>
        <div className={styles.userHeader}>
          <h2>Hey, {userName}</h2>
          <button
            className={styles.authLink}
            onClick={signOutHandler}
          >
            Sign Out
          </button>
        </div>
        <div className={styles.chatInterface}>
          <Title />
          <Body />
          <InputBar />
        </div>
      </div>
    );
  };

  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <div className={styles.pageContent}>
        {renderContent()}
      </div>
      <Footer />
    </div>
  );
};

export default ChatBox;