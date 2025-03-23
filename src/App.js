import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import Login from './components/Login';
import Register from './components/Register';
import TwoFactorSetup from './components/TwoFactorSetup';
import TwoFactorLogin from './components/TwoFactorLogin';
import Home from './components/Home';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [needs2FA, setNeeds2FA] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      
      if (user) {
        setUser(user);
        // Check if 2FA is enrolled
        user.multiFactor.enrolledFactors.length > 0 ? setNeeds2FA(false) : setNeeds2FA(true);
      } else {
        setUser(null);
        setNeeds2FA(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Redirect authenticated users to Home */}
          <Route
            path="/"
            element={
              user && !needs2FA ? (
                <Home user={user} handleLogout={handleLogout} />
              ) : user && needs2FA ? (
                <TwoFactorSetup />
              ) : needs2FA ? (
                <TwoFactorLogin />
              ) : (
                <Login setNeeds2FA={setNeeds2FA} /> // Fixed: Changed 'login' to 'Login'
              )
            }
          />
          {/* Register Route */}
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <Register />}
          />
          {/* Redirect any unknown routes to the root */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;