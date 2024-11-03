import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/fontawesome-free-solid";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { User, LogIn } from "lucide-react";
import "./Navbar.css";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Import Firestore database

const Navbar = () => {
  const [click, setClick] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Fetch user data from Firestore
        const userDoc = doc(db, "users", user.uid); // Assuming users are stored under "users" collection
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          setCurrentUser({
            ...user,
            ...userSnapshot.data() // Merge Firebase Auth data with Firestore user data
          });
        }
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = () => setClick(!click);
  const Close = () => setClick(false);

  const signOutHandler = () => {
    signOut(auth)
      .then(() => {
        setShowUserMenu(false);
        alert("Signed out successfully!");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleUpdateProfile = () => {
    navigate("/sprofile");
    setShowUserMenu(false);
  };

  const isTeacher = () => {
    return currentUser && currentUser.role === "teacher";
  };

  return (
    <div className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          PDH School Of Learning
        </Link>
        
        <div className={click ? "nav-menu active" : "nav-menu"}>
          <div className="nav-item">
            <Link to="/" className="nav-links" onClick={click ? Close : null}>
              Home
            </Link>
          </div>

          {currentUser ? (
            <>
              {isTeacher() ? (
                <div className="nav-item">
                  <Link to="/teacher-panel" className="nav-links" onClick={click ? Close : null}>
                    Teacher Panel
                  </Link>
                </div>
              ) : (
                <div className="nav-item">
                  <Link to="/chatbox" className="nav-links" onClick={click ? Close : null}>
                    Student Chatbot
                  </Link>
                </div>
              )}
              <div className="nav-item">
                <Link to="/contactus" className="nav-links" onClick={click ? Close : null}>
                  Contact Us
                </Link>
              </div>
              <div className="nav-item user-profile" ref={userMenuRef}>
                <div 
                  className="nav-links user-info" 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="avatar">
                    {currentUser.photoURL ? (
                      <img 
                        src={currentUser.photoURL} 
                        alt="user avatar" 
                        className="avatar-img"
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {currentUser.name?.charAt(0) || currentUser.email?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className="username">
                    {currentUser.name || currentUser.email?.split('@')[0]}
                  </span>
                </div>
                
                {showUserMenu && (
                  <div className="user-dropdown">
                    <button onClick={handleUpdateProfile} className="dropdown-item">
                      <User size={16} className="mr-2" />
                      Update Profile
                    </button>
                    <button onClick={signOutHandler} className="dropdown-item">
                      <LogIn size={16} className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="nav-item">
                <Link to="/contactus" className="nav-links" onClick={click ? Close : null}>
                  Contact Us
                </Link>
              </div>
              <div className="nav-item">
                <Link to="/login" className="nav-links auth-button">
                  <LogIn className="inline-block mr-2" size={20} />
                  Login / Signup
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="nav-icon" onClick={handleClick}>
          <FontAwesomeIcon icon={click ? "times" : "bars"} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
