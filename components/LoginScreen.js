// src/components/LoginScreen.js
import React from 'react';

function LoginScreen({ handleLogin }) {
  return (
    <div>
      <h1>Login Screen</h1>
      <button onClick={() => handleLogin('user')}>Login as User</button>
    </div>
  );
}

export default LoginScreen;