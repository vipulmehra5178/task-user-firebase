import React from 'react';

function Home({ user, handleLogout }) {
  return (
    <div>
      <h2>Welcome, {user.email}</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;