import React, { useState } from 'react';
import pb from '../pocketbase';

function Login() {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const authData = await pb
        .collection('users')
        .authWithPassword(email, password);
      if (authData.token) {
        window.location.href = '/';
      }
    } catch (error) {
      setIsError(true);
      if (error.status === 400) {
        setErrorMessage('Email or password is incorrect');
      } else {
        setErrorMessage('An unexpected error occurred');
      }
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <form
          onSubmit={handleLogin}
          style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: '10px',
              fontSize: '16px',
              border: '2px solid black',
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: '10px',
              fontSize: '16px',
              border: '2px solid black',
            }}
          />
          {isError && (
            <div style={{ color: 'red', fontSize: '16px' }}>{errorMessage}</div>
          )}
          <button type="submit" style={{ padding: '10px', fontSize: '16px' }}>
            Login
          </button>
        </form>
        <button
          onClick={() => (window.location.href = '/signup')}
          style={{ marginTop: '20px', padding: '10px', fontSize: '16px' }}
        >
          Not a user? Sign Up
        </button>
      </div>
    </div>
  );
}

export default Login;
