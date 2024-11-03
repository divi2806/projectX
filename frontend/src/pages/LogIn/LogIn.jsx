import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import InputControl from "../../components/InputControl/InputControl";
import styles from "./LogIn.module.css";
import { ThreeCircles } from "react-loader-spinner";

const LogIn = () => {
  const navigate = useNavigate();
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const [values, setValues] = useState({
    email: "",
    pass: "",
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
    if (!values.email || !values.pass) {
      setErrorMsg("Please Fill all fields");
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
      return;
    } else if (!regex.test(values.email)) {
      setErrorMsg("Enter a valid email");
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
      return;
    } else if (values.pass.length < 6) {
      setErrorMsg("Password should have Minimum six characters");
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
      return;
    }
    setErrorMsg("");

    setSubmitButtonDisabled(true);
    try {
      const res = await signInWithEmailAndPassword(auth, values.email, values.pass);
      const userDoc = await getDoc(doc(db, "users", res.user.uid));
      const userData = userDoc.data();
      
      // Store user role in localStorage for easy access
      localStorage.setItem("userRole", userData.role);
      localStorage.setItem("userPermissions", JSON.stringify(userData.permissions));

      setSubmitButtonDisabled(false);
      
      // Redirect based on role
      if (userData.role === "teacher") {
        navigate("/");
      } else {
        navigate("/");
      }
    } catch (err) {
      setSubmitButtonDisabled(false);
      setErrorMsg(err.message);
      setValues({ email: "", pass: "" });
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
            <h1 className={styles.heading}>Login</h1>

            <InputControl
              label="Email"
              value={values.email}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, email: event.target.value }))
              }
              placeholder="Enter email address"
            />
            <InputControl
              label="Password"
              type="password"
              value={values.pass}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, pass: event.target.value }))
              }
              placeholder="Enter Password"
            />

            <div className={styles.footer}>
              <b className={styles.error}>{errorMsg}</b>
              <button
                disabled={submitButtonDisabled}
                onClick={handleSubmission}
              >
                Login
              </button>
              <p>
                Don't have an account?{" "}
                <span>
                  <Link to="/signup">Sign up</Link>
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogIn;