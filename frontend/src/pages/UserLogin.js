import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth.js'
import axios from 'axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import Layout from '../components/Layout/Layout';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [auth, setAuth] = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const res = await axios.post("http://localhost:8086/api/v1/auth/login", { email, password });
        if (res && res.data.success) {
                const { token, user, shop, role } = res.data;
    
                // Update auth context with user/shop/admin details
                setAuth({
                    ...auth,
                    token,
                    user,
                    role,  
                });
    
                // Store the token and user/shop/admin details in localStorage
                localStorage.setItem("auth", JSON.stringify({
                    token,
                    user,
                    role
                }));
                Cookies.set('access_token', token, { expires: 7 });
    
                // Redirect based on role
                if (role === 3) {
                    navigate('/deliveryDashboard');  // Redirect delivery drivers to delivery dashboard
                } else {
                    navigate('/');  // Redirect others to homepage
                }
    
                toast.success("Login successful");
        } else {
            toast.error('Invalid email or password ');
        }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error(error);
    }
  };

  return (
    <Layout>
      <div style={styles.container}>
        <h2 style={styles.log}>Login</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" className='login-button'>Login</button>
        </form>
      </div>
      <style>
      {`
        .login-button {
          padding: 10px;
          font-size: 16px;
          background-color: #BF3131;
          color: #EEEEEE;
          border: none;
          cursor: pointer;
          border-radius: 4px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }
        .login-button:hover {
            background-color: #7D0A0A;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
          }
      `}
      </style>

    </Layout>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  log:{
    color: ' #BF3131',
    letterSpacing: '2px',      // ✅ Increase spacing between letters
    fontFamily: 'Poppins, sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
  },
  // button: {
  //   padding: '10px',
  //   fontSize: '16px',
  //   backgroundColor: '#BF3131',
  //   color: '#EEEEEE',
  //   border: 'none',
  //   cursor: 'pointer',
  //   borderRadius: '4px',
  //   boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',  // Stronger shadow
  //   transition: 'box-shadow 0.3s ease',  // Smooth transition for shadow effect
  // },
  // button:hover {
  //   backgroundColor: '#7D0A0A',
  // }
};

export default Login;
