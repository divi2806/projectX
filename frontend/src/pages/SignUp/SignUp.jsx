import React, { useState, useEffect } from "react";
import styles from "./SignUp.module.css";
import { auth, db } from "../../firebase";
import InputControl from "../../components/InputControl/InputControl";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ThreeCircles } from "react-loader-spinner";

const SignUp = () => {
  const navigate = useNavigate();
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const phoneRegex = /^\+?[1-9][0-9]{7,14}$/;

  const [values, setValues] = useState({
    name: "",
    email: "",
    pass: "",
    phone: "",
    gender: "",
    role: "",
    teacherCode: "" // Special code for teacher registration
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const handleSubmission = async () => {
    if (!values.name || !values.email || !values.pass || !values.phone || !values.gender || !values.role) {
      setErrorMsg("Please Fill all fields");
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
      return;
    }

    // Additional validation for teacher role
    if (values.role === "teacher" && values.teacherCode !== "TEACH2024") {
      setErrorMsg("Invalid teacher code");
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
      return;
    }
    
    if (/^[^a-zA-Z]*$/.test(values.name)) {
      setErrorMsg("Enter a valid name");
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
      return;
    }
    
    if (!regex.test(values.email)) {
      setErrorMsg("Enter a valid email");
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
      return;
    }
    
    if (values.pass.length < 6) {
      setErrorMsg("Password should have Minimum six characters");
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
      return;
    }

    if (!phoneRegex.test(values.phone)) {
      setErrorMsg("Enter a valid phone number");
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
      return;
    }

    setErrorMsg("");
    setSubmitButtonDisabled(true);

    try {
      const res = await createUserWithEmailAndPassword(auth, values.email, values.pass);
      const user = res.user;
      
      // Update auth profile
      await updateProfile(user, {
        displayName: values.name,
      });

      // Store additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: values.name,
        email: values.email,
        phone: values.phone,
        gender: values.gender,
        role: values.role,
        createdAt: new Date(),
        permissions: values.role === "teacher" ? ["admin", "create", "edit", "delete"] : ["view", "submit"]
      });

      setSubmitButtonDisabled(false);
      navigate("/home");
    } catch (err) {
      setSubmitButtonDisabled(false);
      setErrorMsg(err.message);
      setValues({ name: "", email: "", pass: "", phone: "", gender: "", role: "", teacherCode: "" });
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
    }
  };

  return (
    <>
      {loading ? (
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
      ) : (
        <div className={styles.container}>
          <div className={styles.innerBox}>
            <h1 className={styles.heading}>Signup</h1>
            <InputControl
              label="Name"
              placeholder="Enter your name"
              value={values.name}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, name: event.target.value }))
              }
            />
            <InputControl
              label="Email"
              placeholder="Enter email address"
              value={values.email}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, email: event.target.value }))
              }
            />
            <InputControl
              label="Password"
              placeholder="Enter password"
              type="password"
              value={values.pass}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, pass: event.target.value }))
              }
            />
            <InputControl
              label="Phone"
              placeholder="Enter phone number"
              value={values.phone}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, phone: event.target.value }))
              }
            />
            <div className={styles.genderControl}>
              <label>Gender</label>
              <select 
                value={values.gender}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, gender: event.target.value }))
                }
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.genderControl}>
              <label>Role</label>
              <select 
                value={values.role}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, role: event.target.value }))
                }
              >
                <option value="">Select Role</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            {values.role === "teacher" && (
              <InputControl
                label="Teacher Code"
                placeholder="Enter teacher verification code"
                type="password"
                value={values.teacherCode}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, teacherCode: event.target.value }))
                }
              />
            )}

            <div className={styles.footer}>
              <b className={styles.error}>{errorMsg}</b>
              <button onClick={handleSubmission} disabled={submitButtonDisabled}>
                Signup
              </button>
              <p>
                Already have an account as teacher or student?{" "}
                <span>
                  <Link to="/login">Login</Link>
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUp