import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginAdmin.css';
import logo from '../assets/logo.png';
import { AuthContext } from '../App';

function LoginAdmin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`https://anestrack.space/get_credential/login?credential=${credentials.username}&pass=${credentials.password}`);
    const data = await response.json();
    console.log(data); // Log the response data to the console
    // Add validation logic here
    if (data.status) {
      setIsAuthenticated(true);
      navigate('/tabla-admin');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="AnesTrack Logo" className="logo" />
      <h1>ANESTRACK</h1>
      <h2>Login Admin</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" value={credentials.username} onChange={handleChange} placeholder="Username" />
        <input type="password" name="password" value={credentials.password} onChange={handleChange} placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginAdmin;
