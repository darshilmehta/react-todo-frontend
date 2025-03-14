import React, { useState } from 'react';
import pb from '../pocketbase';

function Signup() {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const record = await pb.collection('users').create({
        email,
        password,
        passwordConfirm: password,
        username,
      });
      if (record) {
        window.location.href = '/';
      }
    } catch (error) {
      setIsError(true);
      let errorMessages = '';
      console.log(error.data);
      for (const key in error.data.data) {
        if (error.data?.data[key]?.message) {
          errorMessages += `${key}: ${error.data?.data[key]?.message} `;
        }
      }
      setErrorMessage(errorMessages.trim());
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
          onSubmit={handleSignup}
          style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
        >
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              padding: '10px',
              fontSize: '16px',
              border: '2px solid black',
            }}
          />
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
            <div style={{ color: 'red', marginBottom: '10px' }}>
              {errorMessage}
            </div>
          )}
          <button type="submit" style={{ padding: '10px', fontSize: '16px' }}>
            Sign Up
          </button>
        </form>
        <button
          onClick={() => (window.location.href = '/login')}
          style={{ marginTop: '20px', padding: '10px', fontSize: '16px' }}
        >
          Already a user? Login
        </button>
      </div>
    </div>
  );
}

export default Signup;
