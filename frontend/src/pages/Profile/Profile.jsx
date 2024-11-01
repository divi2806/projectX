// src/pages/Profile/Profile.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/Navbar/Navbar';
import styles from './Profile.module.css';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState({
    fullName: 'Teacher Name',
    nickName: '',
    gender: '',
    country: '',
    language: '',
    timezone: '',
    email: 'teacher@example.com'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Mock update profile action
    try {
      // Simulate API call delay
      setTimeout(() => {
        setIsEditing(false);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <FontAwesomeIcon icon={faSpinner} spin size="2x" color="#046cf1" />
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <Navbar />
      <div className={styles.profileContent}>
        <div className={styles.profileHeader}>
          <div className={styles.profileAvatar}>
            <img 
              src="/api/placeholder/100/100"
              alt="Profile"
              className={styles.avatarImage}
            />
          </div>
          <div className={styles.profileTitle}>
            <h1>{userData.fullName}</h1>
            <p className={styles.emailText}>{userData.email}</p>
          </div>
          <button 
            className={styles.editButton}
            onClick={() => setIsEditing(!isEditing)}
          >
            <FontAwesomeIcon icon={faPencilAlt} /> Edit
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.profileForm}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={userData.fullName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="text"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Gender</label>
              <select
                name="gender"
                value={userData.gender}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={styles.formInput}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Country</label>
              <select
                name="country"
                value={userData.country}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={styles.formInput}
              >
                <option value="">Select Country</option>
                <option value="us">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="ca">Canada</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Language</label>
              <select
                name="language"
                value={userData.language}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={styles.formInput}
              >
                <option value="">Select Language</option>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Time Zone</label>
              <select
                name="timezone"
                value={userData.timezone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={styles.formInput}
              >
                <option value="">Select Timezone</option>
                <option value="EST">Eastern Time</option>
                <option value="CST">Central Time</option>
                <option value="PST">Pacific Time</option>
              </select>
            </div>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          {isEditing && (
            <div className={styles.buttonGroup}>
              <button 
                type="submit" 
                className={styles.saveButton} 
                disabled={loading}
              >
                {loading ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                  'Save Changes'
                )}
              </button>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
