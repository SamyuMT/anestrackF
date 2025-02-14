import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginToken.css';
import logo from '../assets/images.png';
import { AuthContext } from '../App';

function LoginToken() {
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const { setIsTokenValid } = useContext(AuthContext);

  const handleChange = (e) => {
    setToken(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://anestrack.space:5002/get_token/token?token=${token}`);
    const data = await response.json();
    console.log(data); // Log the response data to the console
    // Add validation logic here
    if (data.status) {
      setIsTokenValid(token);
      navigate('/registro');
    } else {
      alert('Invalid token');
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="AnesTrack Logo" className="logo" />
      <h1>ANESTRACK</h1>
      <h2>Login Token</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={token} onChange={handleChange} placeholder="Token" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginToken;
