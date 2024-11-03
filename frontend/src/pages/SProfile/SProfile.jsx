import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { 
  updateProfile, 
  updateEmail, 
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider 
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ThreeCircles } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import styles from "./SProfile.module.css";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [user, setUser] = useState(null);
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    gender: "",
    role: "",
    phoneNumber: "",
  });

  const [passwordValues, setPasswordValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    const fetchUserData = async (user) => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setValues({
            fullName: userData.name || "",
            email: userData.email || "",
            gender: userData.gender || "",
            role: userData.role || "",
            phoneNumber: userData.phone || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setErrorMsg("Failed to fetch user data");
        setTimeout(() => setErrorMsg(""), 3000);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchUserData(user);
        setTimeout(() => setLoading(false), 1500);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSubmission = async (e) => {
    e.preventDefault();
    
    if (!values.fullName || !values.email) {
      setErrorMsg("Name and email are required");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }

    try {
      setLoading(true);
      const currentUser = auth.currentUser;
      
      if (values.fullName !== user.displayName) {
        await updateProfile(currentUser, {
          displayName: values.fullName
        });
      }

      if (values.email !== user.email) {
        await updateEmail(currentUser, values.email);
      }

      await updateDoc(doc(db, "users", currentUser.uid), {
        name: values.fullName,
        email: values.email,
        gender: values.gender,
        phone: values.phoneNumber,
        // Note: role is intentionally omitted from the update
      });

      setSuccessMsg("Profile updated successfully!");
      setIsEditing(false);
      setUser(auth.currentUser);
      
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      setErrorMsg(error.message);
      setTimeout(() => setErrorMsg(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!passwordValues.currentPassword || !passwordValues.newPassword || !passwordValues.confirmPassword) {
      setErrorMsg("All password fields are required");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }

    if (passwordValues.newPassword !== passwordValues.confirmPassword) {
      setErrorMsg("New passwords don't match");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }

    if (passwordValues.newPassword.length < 6) {
      setErrorMsg("New password should be at least 6 characters");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }

    try {
      setLoading(true);
      const currentUser = auth.currentUser;
      
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        passwordValues.currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);
      
      await updatePassword(currentUser, passwordValues.newPassword);
      
      setSuccessMsg("Password updated successfully!");
      setIsChangingPassword(false);
      setPasswordValues({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      setErrorMsg(error.message);
      setTimeout(() => setErrorMsg(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };

  const handleCancel = () => {
    setValues({
      fullName: user.displayName || "",
      email: user.email || "",
      gender: user.gender || "",
      role: values.role || "", // Keep the original role
      phoneNumber: user.phone || "",
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className={styles.loadcontainer}>
        <ThreeCircles
          height="50"
          width="50"
          color="#046cf1"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="three-circles-rotating"
          outerCircleColor=""
          innerCircleColor=""
          middleCircleColor=""
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.innerBox}>
        <div className={styles.leftSection}>
          <div className={styles.profileInfo}>
            <div className={styles.avatar}>
              {values.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className={styles.welcome}>
              Welcome, {values.fullName}
            </div>
          </div>
          <div className={styles.memberSince}>
            Member Since: {new Date(user?.metadata?.creationTime).toLocaleDateString()}
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.header}>
            <h1 className={styles.heading}>Profile</h1>
          </div>

          <div className={styles.formContainer}>
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input
                className={styles.input}
                type="text"
                value={values.fullName}
                onChange={(e) => 
                  setValues((prev) => ({ ...prev, fullName: e.target.value }))
                }
                disabled={!isEditing}
                placeholder="Enter your full name"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                className={styles.input}
                type="email"
                value={values.email}
                onChange={(e) => 
                  setValues((prev) => ({ ...prev, email: e.target.value }))
                }
                disabled={!isEditing}
                placeholder="Enter your email"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input
                className={styles.input}
                type="tel"
                value={values.phoneNumber}
                onChange={(e) => 
                  setValues((prev) => ({ ...prev, phoneNumber: e.target.value }))
                }
                disabled={!isEditing}
                placeholder="Enter your phone number"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Gender</label>
              <select
                className={styles.input}
                value={values.gender}
                onChange={(e) => 
                  setValues((prev) => ({ ...prev, gender: e.target.value }))
                }
                disabled={!isEditing}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Role</label>
              <input
                className={`${styles.input} ${styles.roleInput}`}
                type="text"
                value={values.role}
                disabled={true}
                readOnly
              />
            </div>
          </div>

          {isChangingPassword && (
            <div className={styles.passwordSection}>
              <h2 className={styles.subheading}>Change Password</h2>
              <div className={styles.formGroup}>
                <label>Current Password</label>
                <input
                  className={styles.input}
                  type="password"
                  value={passwordValues.currentPassword}
                  onChange={(e) => 
                    setPasswordValues((prev) => ({ 
                      ...prev, 
                      currentPassword: e.target.value 
                    }))
                  }
                  placeholder="Enter current password"
                />
              </div>
              <div className={styles.formGroup}>
                <label>New Password</label>
                <input
                  className={styles.input}
                  type="password"
                  value={passwordValues.newPassword}
                  onChange={(e) => 
                    setPasswordValues((prev) => ({ 
                      ...prev, 
                      newPassword: e.target.value 
                    }))
                  }
                  placeholder="Enter new password"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Confirm New Password</label>
                <input
                  className={styles.input}
                  type="password"
                  value={passwordValues.confirmPassword}
                  onChange={(e) => 
                    setPasswordValues((prev) => ({ 
                      ...prev, 
                      confirmPassword: e.target.value 
                    }))
                  }
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          )}

          <div className={styles.footer}>
            {errorMsg && <b className={styles.error}>{errorMsg}</b>}
            {successMsg && <b className={styles.success}>{successMsg}</b>}
            
            <div className={styles.buttonGroup}>
              {!isEditing && !isChangingPassword ? (
                <>
                  <button 
                    className={styles.button}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                  <button 
                    className={styles.button}
                    onClick={() => setIsChangingPassword(true)}
                  >
                    Change Password
                  </button>
                </>
              ) : isChangingPassword ? (
                <>
                  <button 
                    className={`${styles.button} ${styles.saveButton}`}
                    onClick={handlePasswordChange}
                  >
                    Update Password
                  </button>
                  <button 
                    className={`${styles.button} ${styles.cancelButton}`}
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordValues({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: ""
                      });
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className={`${styles.button} ${styles.saveButton}`}
                    onClick={handleSubmission}
                  >
                    Save Changes
                  </button>
                  <button 
                    className={`${styles.button} ${styles.cancelButton}`}
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </>
              )}
              <button 
                className={`${styles.button} ${styles.logoutButton}`}
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;