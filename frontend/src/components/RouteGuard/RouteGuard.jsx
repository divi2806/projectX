import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const RouteGuard = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check user role from Firestore
  const [userRole, setUserRole] = useState(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserRole(userDoc.data().role);
      }
      setCheckingRole(false);
    };

    fetchUserRole();
  }, [user]);

  if (checkingRole) {
    return <div>Loading...</div>;
  }

  if (userRole !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default RouteGuard;
